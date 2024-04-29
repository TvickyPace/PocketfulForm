import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import TypeForm from "./TypeForm";
import getComponentTexts from "./util/functions/functions";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
// import apiCallFunction from "./util/APIs/services";

function App() {
  const componentText = getComponentTexts("typeForm");
  const [currentStage, setCurrentStage] = useState("stage1");
  const [currentContent, setCurrentContent] = useState(componentText);
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const [currentNominee, setCurrentNominee] = useState(1);

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

  function handleFormPlainChanges(value, key) {
    const newContent = JSON.parse(JSON.stringify(currentContent));
    newContent[`${currentStage}`].formPlain.formList.filter(
      (item) => item.key === key
    )[0].value = value;
    setCurrentContent(newContent);
  }

  // handleEmailVerification
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
    (stage) => {
      const newContent = JSON.parse(JSON.stringify(currentContent));
      if (stage === "stage1") {
        const formPlainBoolean = newContent[
          `${stage}`
        ].formPlain.formList.every((item) => {
          if (item.trueType === "email") {
            return isValidEmail(item.value);
          }
          return item.value !== "";
        });
        if (formPlainBoolean) {
          const stage1ApiBody = {};
          newContent[`${stage}`].formPlain.formList.map((item) => {
            stage1ApiBody[`${item.key}`] = item.value;
            item.isError = false;
            return item;
          });
          setCurrentContent(newContent);
          if (newContent[`${stage}`].options.value === "Yes") {
            stage1ApiBody[`opt_in`] = true;
            stage1ApiBody[`opt_out`] = false;
            // apiCallFunction("http://127.0.0.1:5000/user-info", stage1ApiBody);
            setCurrentStage("stage2");
          } else {
            stage1ApiBody[`opt_in`] = false;
            stage1ApiBody[`opt_out`] = true;
            // apiCallFunction("http://127.0.0.1:5000/user-info", stage1ApiBody);
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
          const stage2ApiBody = {};
          newContent[`${stage}`].form.formData1.isError = false;
          newContent[`${stage}`].form.formData1.formList.map((item) => {
            stage2ApiBody[`${item.key}`] = item.value;
            item.isError = false;
            return item;
          });
          newContent[`${stage}`].form.formData2.isError = false;
          newContent[`${stage}`].form.formData2.formList.map((item) => {
            stage2ApiBody[`${item.key}`] = item.value;
            item.isError = false;
            return item;
          });
          newContent[`${stage}`].form.formData3.isError = false;
          newContent[`${stage}`].form.formData3.formList.map((item) => {
            stage2ApiBody[`${item.key}`] = item.value;
            item.isError = false;
            return item;
          });
          console.log(stage2ApiBody);
          setCurrentContent(newContent);
          setCurrentStage("stage3");
        }
      } else if (stage === "stage3") {
        setCurrentStage("stage4");
      }
    },
    [currentContent]
  );

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
    <div className="px-5">
      <div className="md:h-14 h-12 bg-white absolute top-0 left-0 w-screen">
        <div className="max-w-[720px] ml-auto mr-auto h-full flex items-center justify-between">
          {componentText?.allStages?.map((item, index, array) => {
            return (
              <React.Fragment key={index}>
                <div
                  className="flex items-center gap-1 min-w-max px-3 select-none cursor-pointer "
                  onClick={() => {
                    if (index < Number(currentStage.slice(5))) {
                      handleNavigation(item.key);
                    }
                  }}
                >
                  {Number(currentStage.slice(5)) > index ? (
                    <CheckCircleRoundedIcon style={{ fontSize: "26px" }} />
                  ) : (
                    <div className=" bg-dark-black rounded-full text-slate-50 w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}

                  <p className=" text-sm md:text-base font-semibold text-dark-black">
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
      <div className=" min-h-screen max-w-[720px] ml-auto mr-auto flex items-center py-24">
        <TypeForm
          currentStage={currentStage}
          componentText={currentContent[`${currentStage}`]}
          handleOptionChanges={handleOptionChanges}
          handleContinue={handleContinue}
          handleFormChanges={handleFormChanges}
          handleFormPlainChanges={handleFormPlainChanges}
          isValidEmail={isValidEmail}
          dropDownStatus={dropDownStatus}
          alternateDropDown={alternateDropDown}
          handleDropDownChanges={handleDropDownChanges}
          changeCurrentNominee={changeCurrentNominee}
          currentNominee={currentNominee}
          handleSkip={handleSkip}
        />
      </div>
    </div>
  );
}

export default App;
