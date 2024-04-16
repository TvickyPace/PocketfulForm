import React, { useState } from "react";
import getComponentTexts from "./util/functions/functions";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import SubdirectoryArrowLeftSharpIcon from "@mui/icons-material/SubdirectoryArrowLeftSharp";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function TypeForm() {
  const componentText = getComponentTexts("typeForm");
  const [currentStage, setCurrentStage] = useState("stage1");
  const [currentContent, setCurrentContent] = useState(
    componentText[`${currentStage}`]
  );

  //option functions
  function handleOptionChanges(value) {
    const newContent = JSON.parse(
      JSON.stringify(componentText[`${currentStage}`])
    );
    newContent.options.value = value;
    setCurrentContent(newContent);
  }

  return (
    <div className=" w-full relative">
      <div className=" text-md font-bold flex items-center gap-[1px] absolute -left-10 top-1.5">
        <p>1</p>
        <ArrowForwardRoundedIcon style={{ fontSize: "16px" }} />
      </div>
      <p className=" text-[24px]">
        Hello, <span className=" font-semibold">Vikas</span>
      </p>
      {currentContent?.options && (
        <div className=" mt-7">
          <p className="text-xl">{currentContent?.options?.heading}</p>
          <div className=" mt-7 ps-4">
            {currentContent?.options?.options.map((item, index) => {
              return (
                <div className=" flex gap-4 items-center mt-7" key={index}>
                  <div
                    className="w-6 h-6 bg-slate-50 border-2 rounded border-dark-black cursor-pointer relative"
                    onClick={() => handleOptionChanges(item)}
                  >
                    {currentContent?.options.value === item && (
                      <DoneRoundedIcon className=" absolute -top-0.5 -left-0.5" />
                    )}
                  </div>
                  <p className=" text-xl">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className=" mt-11 flex items-center gap-3">
        <button className=" bg-dark-black text-slate-50 text-xl py-1.5 px-4 rounded font-medium flex items-center gap-1 hover:bg-light-dark-black">
          Continue
          <DoneRoundedIcon />
        </button>
        <p className="text-sm flex items-center gap-1">
          press{" "}
          <span className="flex items-center font-bold">
            Enter{" "}
            <SubdirectoryArrowLeftSharpIcon style={{ fontSize: "15px" }} />
          </span>
        </p>
      </div>
    </div>
  );
}

export default TypeForm;
