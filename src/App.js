import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import TypeForm from "./TypeForm";
import getComponentTexts from "./util/functions/functions";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import apiCallFunction from "./util/APIs/services";

function App() {
  const componentText = getComponentTexts("typeForm");
  const [currentStage, setCurrentStage] = useState("stage1");
  const [currentContent, setCurrentContent] = useState(componentText);
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const [currentNominee, setCurrentNominee] = useState(1);
  const [currentParams, setCurrentParams] = useState({});
  const [optOutResponse, setOptResponse] = useState({});

  //nominee functions
  function changeCurrentNominee(value) {
    setCurrentNominee(value);
  }

  //dropdown function
  function alternateDropDown() {
    setDropDownStatus(!dropDownStatus);
  }

  function closeDropDown() {
    setDropDownStatus(false);
  }

  function handleDropDownChanges(value, key) {
    const newContent = JSON.parse(JSON.stringify(currentContent));
    newContent[`${currentStage}`].form[
      `formData${currentNominee}`
    ].formList.filter((item) => item.key === key)[0].value = value;
    setCurrentContent(newContent);
    closeDropDown();
  }

  //option functions
  function handleOptionChanges(value) {
    const newContent = JSON.parse(JSON.stringify(currentContent));
    newContent[`${currentStage}`].options.value = value;
    setCurrentContent(newContent);
  }

  //form functions
  function handleFormChanges(value, key) {
    const newContent = JSON.parse(JSON.stringify(currentContent));
    newContent[`${currentStage}`].form[
      `formData${currentNominee}`
    ].formList.filter((item) => item.key === key)[0].value = value;
    setCurrentContent(newContent);
  }

  //form clear function
  function clearNomineeForm() {
    const newContent = JSON.parse(JSON.stringify(currentContent));
    newContent[`${currentStage}`].form[
      `formData${currentNominee}`
    ].formList.map((item) => {
      if (item.type === "dropdown") {
        return (item.value = "Choose a nominee relation");
      } else {
        item.value = "";
      }
      return item;
    });
    setCurrentContent(newContent);
  }

  //handle formPlain changes
  const handleFormPlainChanges = useCallback(
    (value, key) => {
      const newContent = JSON.parse(JSON.stringify(currentContent));
      newContent[`${currentStage}`].formPlain.formList.filter(
        (item) => item.key === key
      )[0].value = value;
      setCurrentContent(newContent);
    },
    [currentContent, currentStage]
  );

  // handle EmailVerification
  function isValidEmail(email) {
    // Regular expression for basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  //handle Skip
  function handleSkip(stage) {
    if (stage === "stage2") {
      const newContent = JSON.parse(JSON.stringify(currentContent));
      newContent[`${currentStage}`].form.formData1.formList.map((item) => {
        item.value = "";
        return item;
      });
      newContent[`${currentStage}`].form.formData2.formList.map((item) => {
        item.value = "";
        return item;
      });
      newContent[`${currentStage}`].form.formData3.formList.map((item) => {
        item.value = "";
        return item;
      });
      setCurrentContent(newContent);
      setCurrentStage("stage3");
    }
  }

  //handle navigation
  function handleNavigation(stage) {
    setCurrentStage(stage);
  }

  //handle continuation
  const handleContinue = useCallback(
    async (stage) => {
      const stage1ApiBody = {};
      const stage2ApiBody = {};
      const optOutNewResponse = {};
      const newContent = JSON.parse(JSON.stringify(currentContent));
      if (stage === "stage1") {
        const formPlainBoolean = newContent[
          `${stage}`
        ].formPlain.formList.every((item) => {
          if (currentParams[`${item.key}`]) {
            return true;
          } else {
            if (item.trueType === "email") {
              return isValidEmail(item.value);
            }
            return item.value !== "";
          }
        });
        if (formPlainBoolean) {
          newContent[`${stage}`].formPlain.formList.map((item) => {
            if (currentParams[`${item.key}`]) {
              if (item.key === "dp_id") {
                stage1ApiBody[`client_id`] = currentParams[`${item.key}`];
              }
              stage1ApiBody[`${item.key}`] = currentParams[`${item.key}`];
            } else {
              if (item.key === "dp_id") {
                stage1ApiBody[`client_id`] = item.value;
              }
              stage1ApiBody[`${item.key}`] = item.value;
            }

            item.isError = false;
            return item;
          });
          setCurrentContent(newContent);
          if (newContent[`${stage}`].options.value === "Yes") {
            setCurrentStage("stage2");
          } else {
            stage1ApiBody[`opt_in`] = false;
            stage1ApiBody[`opt_out`] = true;
            const optOutResponse = await apiCallFunction(
              "http://eform.pacefin.in/user-info",
              stage1ApiBody
            );
            const currentResponse = optOutResponse.data.response.response;
            optOutNewResponse[`entity_id`] =
              currentResponse.access_token.entity_id;
            optOutNewResponse[`callback_id`] = currentResponse.callback;
            optOutNewResponse[`email`] = stage1ApiBody.email;
            optOutNewResponse[`token_id`] = currentResponse.access_token.id;
            setOptResponse(optOutNewResponse);
            setCurrentStage("stage3");
          }
        } else {
          newContent[`${stage}`].formPlain.formList.map((item) => {
            if (item.value === "") {
              item.isError = true;
            }
            return item;
          });
          setCurrentContent(newContent);
        }
      } else if (stage === "stage2") {
        const form1Boolean = newContent[
          `${stage}`
        ].form.formData1.formList.every((item) => {
          if (item.type === "dropdown") {
            if (item.value === "Choose a nominee relation") {
              return false;
            } else {
              return true;
            }
          }
          if (item.trueType === "email") {
            return isValidEmail(item.value);
          }
          return item.value !== "";
        });
        const form2Boolean =
          newContent[`${stage}`].form.formData2.formList.every((item) => {
            if (item.type === "dropdown") {
              if (item.value === "Choose a nominee relation") {
                return false;
              } else {
                return true;
              }
            }
            if (item.trueType === "email") {
              return isValidEmail(item.value);
            }
            return item.value !== "";
          }) ||
          newContent[`${stage}`].form.formData2.formList.every((item) => {
            if (item.type === "dropdown") {
              if (item.value === "Choose a nominee relation") {
                return true;
              } else {
                return false;
              }
            }
            return item.value === "";
          });
        const form2SimpleBoolean = newContent[
          `${stage}`
        ].form.formData2.formList.every((item) => {
          if (item.type === "dropdown") {
            if (item.value === "Choose a nominee relation") {
              return false;
            } else {
              return true;
            }
          }
          if (item.trueType === "email") {
            return isValidEmail(item.value);
          }
          return item.value !== "";
        });
        const form3Boolean =
          newContent[`${stage}`].form.formData3.formList.every((item) => {
            if (item.type === "dropdown") {
              if (item.value === "Choose a nominee relation") {
                return false;
              } else {
                return true;
              }
            }
            if (item.trueType === "email") {
              return isValidEmail(item.value);
            }
            return item.value !== "";
          }) ||
          newContent[`${stage}`].form.formData3.formList.every((item) => {
            if (item.type === "dropdown") {
              if (item.value === "Choose a nominee relation") {
                return true;
              } else {
                return false;
              }
            }
            return item.value === "";
          });
        const form3SimpleBoolean = newContent[
          `${stage}`
        ].form.formData3.formList.every((item) => {
          if (item.type === "dropdown") {
            if (item.value === "Choose a nominee relation") {
              return false;
            } else {
              return true;
            }
          }
          if (item.trueType === "email") {
            return isValidEmail(item.value);
          }
          return item.value !== "";
        });
        if (!form1Boolean) {
          newContent[`${stage}`].form.formData1.isError = true;
          newContent[`${stage}`].form.formData1.formList.map((item) => {
            if (item.value === "") {
              item.isError = true;
            } else if (item.value === "Choose a nominee relation") {
              item.isError = true;
            }
            return item;
          });
          setCurrentContent(newContent);
        }
        if (!form2Boolean) {
          newContent[`${stage}`].form.formData2.isError = true;
          newContent[`${stage}`].form.formData2.formList.map((item) => {
            if (item.value === "") {
              item.isError = true;
            } else if (item.value === "Choose a nominee relation") {
              item.isError = true;
            }
            return item;
          });
          setCurrentContent(newContent);
        }
        if (!form3Boolean) {
          newContent[`${stage}`].form.formData3.isError = true;
          newContent[`${stage}`].form.formData3.formList.map((item) => {
            if (item.value === "") {
              item.isError = true;
            } else if (item.value === "Choose a nominee relation") {
              item.isError = true;
            }
            return item;
          });
          setCurrentContent(newContent);
        } else if (form1Boolean && form2Boolean && form3Boolean) {
          newContent[`${stage}`].form.formData1.isError = false;
          newContent[`${stage}`].form.formData1.formList.map((item) => {
            stage2ApiBody[`${item.key}`] =
              item.value !== "" && item.value !== "Choose a nominee relation"
                ? item.value
                : "NA";
            item.isError = false;
            return item;
          });
          newContent[`${stage}`].form.formData2.isError = false;
          newContent[`${stage}`].form.formData2.formList.map((item) => {
            stage2ApiBody[`${item.key}`] =
              item.value !== "" && item.value !== "Choose a nominee relation"
                ? item.value
                : "NA";
            item.isError = false;
            return item;
          });
          newContent[`${stage}`].form.formData3.isError = false;
          newContent[`${stage}`].form.formData3.formList.map((item) => {
            stage2ApiBody[`${item.key}`] =
              item.value !== "" && item.value !== "Choose a nominee relation"
                ? item.value
                : "NA";
            item.isError = false;
            return item;
          });
          if (form2SimpleBoolean && form3SimpleBoolean) {
            stage2ApiBody[`nominee1_share`] = "33";
            stage2ApiBody[`nominee2_share`] = "33";
            stage2ApiBody[`nominee3_share`] = "33";
          } else if (form2SimpleBoolean || form3SimpleBoolean) {
            if (form2SimpleBoolean) {
              stage2ApiBody[`nominee1_share`] = "50";
              stage2ApiBody[`nominee2_share`] = "50";
              stage2ApiBody[`nominee3_share`] = "NA";
            }
            if (form3SimpleBoolean) {
              stage2ApiBody[`nominee1_share`] = "50";
              stage2ApiBody[`nominee2_share`] = "NA";
              stage2ApiBody[`nominee3_share`] = "50";
            }
          } else if (!form2SimpleBoolean && !form3SimpleBoolean) {
            stage2ApiBody[`nominee1_share`] = "100";
            stage2ApiBody[`nominee2_share`] = "NA";
            stage2ApiBody[`nominee3_share`] = "NA";
          }
          newContent[`stage1`].formPlain.formList.forEach((item) => {
            if (currentParams[`${item.key}`]) {
              if (item.key === "dp_id") {
                stage2ApiBody[`client_id`] = currentParams[`${item.key}`];
              }
              stage2ApiBody[`${item.key}`] = currentParams[`${item.key}`];
            } else {
              if (item.key === "dp_id") {
                stage2ApiBody[`client_id`] = item.value;
              }
              stage2ApiBody[`${item.key}`] = item.value;
            }
          });
          stage2ApiBody[`opt_in`] = true;
          stage2ApiBody[`opt_out`] = false;
          const optOutResponse = await apiCallFunction(
            "http://eform.pacefin.in/nominee-info",
            stage2ApiBody
          );
          console.log(optOutResponse);
          const currentResponse = optOutResponse.data.response;
          optOutNewResponse[`entity_id`] =
            currentResponse.access_token.entity_id;
          optOutNewResponse[`callback_id`] = currentResponse.callback;
          optOutNewResponse[`email`] = stage2ApiBody.email;
          optOutNewResponse[`token_id`] = currentResponse.access_token.id;
          setOptResponse(optOutNewResponse);
          setCurrentStage("stage3");
        }
      }
    },
    [currentContent, currentParams]
  );

  useEffect(() => {
    const paramsObject = {};
    window.location.search
      .slice(1)
      .split("&")
      .forEach((item) => {
        const paramArray = item.split("=");
        paramsObject[`${paramArray[0]}`] = paramArray[1];
      });
    setCurrentParams(paramsObject);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleContinue(currentStage);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStage, handleContinue]);

  return (
    <>
      <div className=" bg-white px-1 relative navMax:py-6 sm:pt-[80px] pt-[69px] sm:pb-5 pb-4 ">
        <img
          src="https://www.pacefin.com/images/Logo_default.png"
          alt="pace logo"
          className="absolute navMax:left-5 navMax:top-1/2 navMax:-translate-y-1/2 navMax:translate-x-0 navMax:w-28 left-1/2 -translate-x-1/2 top-5 sm:w-[120px] w-[90px] "
        />
        <div className="max-w-[720px] ml-auto mr-auto h-full flex items-center justify-between">
          {componentText?.allStages?.map((item, index, array) => {
            return (
              <React.Fragment key={index}>
                <div
                  className={`flex items-center gap-1 min-w-max navMin:px-2 px-0.5 select-none cursor-pointer ${
                    currentStage === "stage3" && "text-slate-500 cursor-auto"
                  } `}
                  onClick={() => {
                    if (index < Number(currentStage.slice(5))) {
                      currentStage !== "stage3" && handleNavigation(item.key);
                    }
                  }}
                >
                  {Number(currentStage.slice(5)) > index ? (
                    <CheckCircleRoundedIcon className=" md:text-[26px] text-[20px] " />
                  ) : (
                    <div className=" bg-dark-black rounded-full text-slate-50 md:w-6 md:h-6 w-5 h-5 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}

                  <p
                    className={`text-xs md:text-base font-semibold text-dark-black ${
                      currentStage === "stage3" && "text-slate-500 cursor-auto"
                    }`}
                  >
                    {item?.heading}
                  </p>
                </div>
                {index !== array.length - 1 && (
                  <div
                    className={`${
                      Number(currentStage.slice(5)) > index
                        ? "w-full border-0 border-b-[1px] border-light-dark-black"
                        : "w-full border-0 border-b-[1px] border-dotted border-light-dark-black"
                    } `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="px-5">
        <div className=" min-h-screen max-w-[720px] ml-auto mr-auto py-14 flex items-center">
          <div className="mt-auto mb-auto w-full">
            <TypeForm
              currentStage={currentStage}
              componentText={currentContent[`${currentStage}`]}
              handleOptionChanges={handleOptionChanges}
              handleContinue={handleContinue}
              handleFormChanges={handleFormChanges}
              clearNomineeForm={clearNomineeForm}
              handleFormPlainChanges={handleFormPlainChanges}
              isValidEmail={isValidEmail}
              dropDownStatus={dropDownStatus}
              alternateDropDown={alternateDropDown}
              handleDropDownChanges={handleDropDownChanges}
              changeCurrentNominee={changeCurrentNominee}
              currentNominee={currentNominee}
              handleSkip={handleSkip}
              currentParams={currentParams}
              optOutResponse={optOutResponse}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
