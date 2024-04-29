import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import TypeForm from "./TypeForm";
import getComponentTexts from "./util/functions/functions";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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

  //handle continuation
  const handleContinue = useCallback(
    (stage) => {
      const newContent = JSON.parse(JSON.stringify(currentContent));
      if (stage === "stage1") {
        const formPlainBoolean = newContent[
          `${stage}`
        ].formPlain.formList.every((item) => item.value !== "");
        if (formPlainBoolean) {
          newContent[`${stage}`].formPlain.formList.map((item) => {
            item.isError = false;
            return item;
          });
          setCurrentContent(newContent);
          if (newContent[`${stage}`].options.value === "Yes") {
            setCurrentStage("stage2");
          } else {
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
          newContent[`${stage}`].form.formData1.isError = false;
          newContent[`${stage}`].form.formData1.formList.map((item) => {
            item.isError = false;
            return item;
          });
          newContent[`${stage}`].form.formData2.isError = false;
          newContent[`${stage}`].form.formData2.formList.map((item) => {
            item.isError = false;
            return item;
          });
          newContent[`${stage}`].form.formData3.isError = false;
          newContent[`${stage}`].form.formData3.formList.map((item) => {
            item.isError = false;
            return item;
          });
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
                <div className="flex items-center gap-1 min-w-max px-3 select-none">
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
