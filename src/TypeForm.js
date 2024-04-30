import React from "react";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import SubdirectoryArrowLeftSharpIcon from "@mui/icons-material/SubdirectoryArrowLeftSharp";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

function TypeForm({
  componentText,
  handleOptionChanges,
  handleContinue,
  currentStage,
  handleFormChanges,
  clearNomineeForm,
  handleFormPlainChanges,
  isValidEmail,
  dropDownStatus,
  alternateDropDown,
  handleDropDownChanges,
  currentNominee,
  changeCurrentNominee,
  handleSkip,
  currentParams,
}) {
  return (
    <div className=" w-full relative flex flex-col gap-y-6 ">
      {currentStage !== "stage4" && (
        <div
          className={`text-md font-bold lg:flex items-center gap-[1px] absolute -left-10 hidden ${
            currentStage === "stage1" ? "top-1.5" : "top-[1px]"
          } `}
        >
          <p>{Number(currentStage.slice(5))}</p>
          <ArrowForwardRoundedIcon style={{ fontSize: "16px" }} />
        </div>
      )}
      {currentStage === "stage1" && (
        <p className=" text-[24px]">
          Hello, <span className=" font-semibold">{currentParams.name}</span>
        </p>
      )}{" "}
      {componentText?.formPlain && (
        <div>
          <div className=" flex flex-col gap-y-9">
            {componentText?.formPlain.formList.map((item, index) => {
              return (
                <div key={index}>
                  <p className=" text-lg mb-1 select-none">
                    {item?.label}
                    {item?.required && " *"}
                  </p>
                  {item.type === "text" && (
                    <input
                      type="text"
                      disabled={currentParams[`${item.key}`]}
                      placeholder={item.placeHolder}
                      value={item.value || currentParams[`${item.key}`]}
                      onChange={(e) => {
                        let newValue = e.target.value;
                        if (item.trueType === "text") {
                          // Allow only alphabets and spaces
                          newValue = newValue.replace(/[^A-Za-z\s]/g, "");
                        } else if (item.trueType === "number") {
                          // Allow only digits
                          newValue = newValue.replace(/\D/g, "");
                        } else if (item.trueType === "email") {
                          // Validate email format
                          // This regex pattern is a simple one and may not cover all valid email formats.
                          const textWithEmailPattern = /^[a-zA-Z0-9@.]*$/;
                          if (!textWithEmailPattern.test(newValue)) {
                            // If the entered email format is invalid, do not update the value
                            return;
                          }
                        } else if (item.trueType === "address") {
                          // Allow text, numbers, and spaces
                          newValue = newValue.replace(/[^a-zA-Z0-9,\s]/g, "");
                        } else if (item.trueType === "id") {
                          // Allow text, numbers, and spaces
                          newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
                        }
                        handleFormPlainChanges(newValue, item.key);
                      }}
                      className={`w-full bg-transparent border-b-[1px] ${
                        item.isError &&
                        item.value === "" &&
                        !currentParams[`${item.key}`]
                          ? "border-red-600 border-opacity-80"
                          : "border-dark-black border-opacity-30"
                      }   focus:outline-none focus:border-opacity-100 focus:border-b-2 py-2 text-2xl ${
                        currentParams[`${item.key}`] && "text-slate-800"
                      }`}
                    />
                  )}
                  {item.isError &&
                    item.type === "text" &&
                    item.value === "" &&
                    !currentParams[`${item.key}`] && (
                      <p className=" text-red-600 text-sm mt-1 font-medium">
                        {item.error}
                      </p>
                    )}
                  {item.trueType === "email" &&
                    item.value !== "" &&
                    !isValidEmail(item.value) && (
                      <p className=" text-red-600 text-sm mt-1 font-medium">
                        {item?.invalid}
                      </p>
                    )}
                  {item.type === "dropdown" && (
                    <div className=" relative">
                      <div
                        className={`${
                          item.isError && item.value === ""
                            ? "border-red-600 border-opacity-80"
                            : "border-dark-black border-opacity-30"
                        } border-b-[1px] py-2 relative cursor-pointer`}
                      >
                        <p
                          className={`text-2xl select-none ${
                            item.value
                              ? " text-opacity-100 text-dark-black"
                              : "text-opacity-50 text-dark-black"
                          }`}
                          onClick={alternateDropDown}
                        >
                          {item.value !== "" ? item.value : item.placeHolder}
                        </p>
                        <KeyboardArrowDownRoundedIcon
                          className=" absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={alternateDropDown}
                        />
                        {dropDownStatus && (
                          <ul className=" absolute top-full w-full bg-white rounded-b px-4">
                            {item?.dropdownOptions.map(
                              (element, elementIndex, elementArray) => {
                                return (
                                  <li
                                    key={elementIndex}
                                    className={` py-2 text-lg ${
                                      elementIndex !==
                                        elementArray.length - 1 &&
                                      "border-b-[1px] border-dark-black border-opacity-30"
                                    } `}
                                    onClick={() =>
                                      handleDropDownChanges(element, item.key)
                                    }
                                  >
                                    {element}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                  {item.isError &&
                    item.type === "dropdown" &&
                    item.value === "" && (
                      <p className=" text-red-600 text-sm mt-1 font-medium">
                        {item.error}
                      </p>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {componentText?.options && (
        <div>
          <p className="text-xl">{componentText?.options?.heading}</p>
          <div className=" mt-7 ps-4">
            {componentText?.options?.options.map((item, index) => {
              return (
                <div className=" flex gap-4 items-center mt-7" key={index}>
                  <div
                    className="w-6 h-6 bg-slate-50 border-2 rounded border-dark-black cursor-pointer relative"
                    onClick={() => handleOptionChanges(item)}
                  >
                    {componentText?.options.value === item && (
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
      {componentText?.form && (
        <div>
          <div className="flex justify-between items-center">
            <p className="text-xl flex items-center gap-2">
              {componentText?.form?.heading}{" "}
              <span className="bg-dark-black rounded-full text-slate-50 w-5 h-5 flex items-center justify-center text-base">
                {currentNominee}
              </span>
            </p>
            <button className=" bg-dark-black text-slate-50 text-xl py-1.5 px-4 rounded font-medium flex items-center gap-1 hover:bg-light-dark-black" >
              Clear Details
              <DeleteForeverRoundedIcon />
            </button>
          </div>

          <div className=" mt-7 flex flex-col gap-y-9">
            {componentText?.form[`formData${currentNominee}`].formList.map(
              (item, index) => {
                return (
                  <div key={index}>
                    <p className=" text-lg mb-1 select-none">
                      {item?.label}
                      {item?.required && " *"}
                    </p>
                    {item.type === "text" && (
                      <input
                        type="text"
                        placeholder={item.placeHolder}
                        value={item.value}
                        className={`w-full bg-transparent border-b-[1px] ${
                          item.isError && item.value === ""
                            ? "border-red-600 border-opacity-80"
                            : "border-dark-black border-opacity-30"
                        }   focus:outline-none focus:border-opacity-100 focus:border-b-2 py-2 text-2xl`}
                        onChange={(e) => {
                          let newValue = e.target.value;
                          if (item.trueType === "text") {
                            // Allow only alphabets and spaces
                            newValue = newValue.replace(/[^A-Za-z\s]/g, "");
                          } else if (item.trueType === "number") {
                            // Allow only digits
                            newValue = newValue.replace(/\D/g, "");
                          } else if (item.trueType === "email") {
                            // Validate email format
                            // This regex pattern is a simple one and may not cover all valid email formats.
                            const textWithEmailPattern = /^[a-zA-Z0-9@.]*$/;
                            if (!textWithEmailPattern.test(newValue)) {
                              // If the entered email format is invalid, do not update the value
                              return;
                            }
                          } else if (item.trueType === "address") {
                            // Allow text, numbers, and spaces
                            newValue = newValue.replace(/[^a-zA-Z0-9,\s]/g, "");
                          } else if (item.trueType === "id") {
                            // Allow text, numbers, and spaces
                            newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
                          }
                          handleFormChanges(newValue, item.key);
                        }}
                      />
                    )}
                    {item.isError &&
                      item.type === "text" &&
                      item.value === "" && (
                        <p className=" text-red-600 text-sm mt-1 font-medium">
                          {item.error}
                        </p>
                      )}
                    {item.trueType === "email" &&
                      item.value !== "" &&
                      !isValidEmail(item.value) && (
                        <p className=" text-red-600 text-sm mt-1 font-medium">
                          {item?.invalid}
                        </p>
                      )}{" "}
                    {item.type === "dropdown" && (
                      <div className=" relative">
                        <div
                          className={`${
                            item.isError && item.value === ""
                              ? "border-red-600 border-opacity-80"
                              : "border-dark-black border-opacity-30"
                          } border-b-[1px] py-2 relative cursor-pointer`}
                        >
                          <p
                            className={`text-2xl select-none ${
                              item.value !== "Choose a nominee relation"
                                ? " text-opacity-100 text-dark-black"
                                : "text-opacity-50 text-dark-black"
                            }`}
                            onClick={alternateDropDown}
                          >
                            {item.value}
                          </p>
                          <KeyboardArrowDownRoundedIcon
                            className=" absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={alternateDropDown}
                          />
                          {dropDownStatus && (
                            <ul className=" absolute top-full w-full bg-white rounded-b">
                              {item?.dropdownOptions.map(
                                (element, elementIndex, elementArray) => {
                                  return (
                                    <li
                                      key={elementIndex}
                                      className={` pt-2 text-lg  hover:bg-dark-black hover:text-white transition-all duration-100 `}
                                      onClick={() =>
                                        handleDropDownChanges(element, item.key)
                                      }
                                    >
                                      <p className="px-4">{element}</p>
                                      {elementIndex !==
                                      elementArray.length - 1 ? (
                                        <div className=" flex justify-center mt-2 ">
                                          <div className=" border-b-[1px] border-dark-black border-opacity-30 w-[95%] " />
                                        </div>
                                      ) : (
                                        <div className="pt-2" />
                                      )}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                    {item.isError &&
                      item.type === "dropdown" &&
                      item.value === "Choose a nominee relation" && (
                        <p className=" text-red-600 text-sm mt-1 font-medium">
                          {item.error}
                        </p>
                      )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
      {componentText?.iframe && (
        <div>
          <p className="text-xl">{componentText?.iframe?.heading}</p>
          <iframe
            className=" mt-7 w-full h-96 border-2 border-dark-black rounded-xl"
            src={componentText?.iframe?.src}
            title={componentText?.iframe?.title}
          ></iframe>
        </div>
      )}{" "}
      {componentText?.Success && (
        <div>
          <p className="text-2xl text-center">
            {componentText?.Success?.heading}
          </p>
        </div>
      )}
      {currentStage === "stage2" && (
        <div className="mt-2 flex items-center gap-3">
          <p className="text-xl font-medium select-none">Nominees -</p>
          {[1, 2, 3].map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  componentText.form[`formData${item}`].isError
                    ? "text-red-600 border border-red-600 "
                    : "text-dark-black"
                } ${
                  item === currentNominee ? "bg-[#cbd9ec]" : "bg-slate-200"
                }  cursor-pointer   text-xl py-1 px-3.5 rounded-md font-medium flex items-center gap-1.5 hover:bg-dark-black  hover:text-light-background`}
                onClick={() => changeCurrentNominee(item)}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
      {currentStage !== "stage4" && (
        <div className=" mt-7 flex items-center justify-between flex-wrap gap-x-2 gap-y-5">
          <div className="flex gap-3 items-center">
            <button
              className=" bg-dark-black text-slate-50 text-xl py-1.5 px-4 rounded font-medium flex items-center gap-1 hover:bg-light-dark-black"
              onClick={() => handleContinue(currentStage)}
            >
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
          {currentStage === "stage2" && (
            <button
              className=" bg-dark-black text-slate-50 text-xl py-1.5 px-4 rounded font-medium flex items-center gap-1 hover:bg-light-dark-black"
              onClick={() => handleSkip(currentStage)}
            >
              Skip and Opt-out
              <SkipNextIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TypeForm;
