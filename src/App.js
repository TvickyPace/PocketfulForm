import React, { useEffect, useState } from "react";
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
    newContent[`${currentStage}`].form[`formData${currentNominee}`].filter(
      (item) => item.key === key
    )[0].value = value;
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
    newContent[`${currentStage}`].form[`formData${currentNominee}`].filter(
      (item) => item.key === key
    )[0].value = value;
    setCurrentContent(newContent);
  }

  //handle continuation
  function handleContinue(stage) {
    if (stage === "stage1") {
      setCurrentStage("stage2");
    } else if (stage === "stage2") {
      setCurrentStage("stage3");
    } else if (stage === "stage3") {
      setCurrentStage("stage4");
    }
  }

  function navigateStage(stage) {
    setCurrentStage(stage);
  }

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleContinue(currentStage);
      }
    });
    return () => {
      window.removeEventListener("keydown", () => {});
    };
  }, [currentStage]);

  console.log(currentNominee);
  return (
    <>
      <div className="h-14 bg-white absolute top-0 w-screen">
        <div className="max-w-[720px] ml-auto mr-auto h-14 flex items-center justify-between">
          {componentText?.allStages?.map((item, index, array) => {
            return (
              <React.Fragment key={index}>
                <div
                  className="flex items-center gap-1 min-w-max px-4 cursor-pointer select-none"
                  onClick={() => navigateStage(item.key)}
                >
                  {Number(currentStage.slice(5)) > index ? (
                    <CheckCircleRoundedIcon style={{ fontSize: "26px" }} />
                  ) : (
                    <div className=" bg-dark-black rounded-full text-slate-50 w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}

                  <p className=" text-md font-semibold text-dark-black">
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
      <div className=" min-h-screen max-w-[720px] ml-auto mr-auto flex items-center">
        <TypeForm
          currentStage={currentStage}
          componentText={currentContent[`${currentStage}`]}
          handleOptionChanges={handleOptionChanges}
          handleContinue={handleContinue}
          handleFormChanges={handleFormChanges}
          dropDownStatus={dropDownStatus}
          alternateDropDown={alternateDropDown}
          handleDropDownChanges={handleDropDownChanges}
          changeCurrentNominee={changeCurrentNominee}
          currentNominee={currentNominee}
        />
      </div>
    </>
  );
}

export default App;
