import React, { useEffect, useState } from "react";
import "./App.css";
import TypeForm from "./TypeForm";
import getComponentTexts from "./util/functions/functions";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

function App() {
  const componentText = getComponentTexts("typeForm");
  const [currentStage, setCurrentStage] = useState("stage1");
  const [currentContent, setCurrentContent] = useState(componentText);

  //option functions
  function handleOptionChanges(value) {
    const newContent = JSON.parse(JSON.stringify(componentText));
    newContent[`${currentStage}`].options.value = value;
    newContent["allStages"].filter(
      (item) => item.key === currentStage
    )[0].value = value;
    setCurrentContent(newContent);
  }

  //handle continuation
  function handleContinue(stage) {
    if (stage === "stage1") {
      setCurrentStage("stage2");
    }
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
  }, []);

  return (
    <>
      <div className="h-14 bg-white absolute top-0 w-screen">
        <div className="max-w-[720px] ml-auto mr-auto h-14 flex items-center justify-between">
          {componentText?.allStages?.map((item, index, array) => {
            return (
              <React.Fragment key={index}>
                <div className="flex items-center gap-1 min-w-max px-4">
                  {item.key === currentStage ? (
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
        />
      </div>
    </>
  );
}

export default App;
