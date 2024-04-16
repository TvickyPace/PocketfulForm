import React from "react";
import getComponentTexts from "./util/functions/functions";

function TypeForm() {
  const componentText = getComponentTexts("typeForm");
  console.log(componentText);
  return (
    <div className=" w-full">
      <p className=" text-2xl">
        Hello, <span className=" font-semibold">Vikas</span>
      </p>
    </div>
  );
}

export default TypeForm;
