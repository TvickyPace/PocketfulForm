import React, { useEffect, useState } from "react";
import "./App.css";
import TypeForm from "./TypeForm";
import getComponentTexts from "./util/functions/functions";

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
      console.log(stage);
      // setCurrentStage("stage2");
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleContinue(currentStage);
      }
    });
    return () => {
      window.removeEventListener("keydown");
    };
  }, []);

  return (
    <>
      <div className="h-14 bg-white absolute top-0 w-screen">
        <div className="max-w-[720px] ml-auto mr-auto h-14">tet</div>
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
