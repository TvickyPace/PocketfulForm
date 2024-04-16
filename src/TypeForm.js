import React, { useState } from "react";
import getComponentTexts from "./util/functions/functions";

function TypeForm() {
  const componentText = getComponentTexts("typeForm");
  const [currentStage, setCurrentStage] = useState("stage1");
  const [currentContent, setCurrentContent] = useState(
    componentText[`${currentStage}`]
  );
  return (
    <div className=" w-full">
      <p className=" text-[24px]">
        Hello, <span className=" font-semibold">Vikas</span>
      </p>
      {currentContent?.heading && (
        <p className="text-xl mt-7">{currentContent?.heading}</p>
      )}
      {currentContent?.options && (
        <div className=" mt-5 ps-4">
          {currentContent?.options?.options.map((item) => {
            return (
              <div className=" flex gap-4 items-center mt-5">
                <div className="w-5 h-5 bg-slate-50 border-2 rounded border-slate-600 cursor-pointer" />
                <p className=" text-xl">{item}</p>
              </div>
            );
          })}
        </div>
      )}
      <div className=" mt-9">
        <button className=" bg-slate-950 text-slate-50 text-xl py-1.5 px-4 rounded font-medium">
          Continue
        </button>
      </div>
    </div>
  );
}

export default TypeForm;
