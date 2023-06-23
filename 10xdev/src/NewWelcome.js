import React from 'react'
import { useNavigate } from "react-router-dom";
import DropDownButton from "./DropDownButton/DropDownButton";
const NewWelcome = () => {
    const navigate = useNavigate();
    const handleSetupClick = () => {
        navigate("/repos");
    }
  return (
    <div className="flex justify-center">
    <div className="absolute top-3 right-5">
            <DropDownButton />
          </div>
        <div className=" w-1/2 p-6 ">
        <div className="">
          <div className="h-[16vh] ">
            <h3 className="sm:text-2xl font-bold lg:text-4xl text-center"> welcome to </h3>
            <div className="lg:text-6xl font-bold italic text-blue-900 text-center pt-5 sm:text-3xl">
                10XDEV.AI
            </div>
            <img src='https://i.postimg.cc/3rfPFhq9/start.jpg' alt="start" className="h-[50vh] w-[50vh] mx-auto"/>
            <h6 className="text-center"
                style={{ 
                    fontWeight: "semibold",
                    fontSize: "1.25rem",
                    lineHeight: "1.75rem",
                    color: "#374151",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                    maxWidth: "100%",
                    
                }}
            >Add your repository for Auto GPT to start working on.</h6>
            <div className="flex justify-center">
            <button
                    onClick={handleSetupClick}
                    className="bg-blue-900 hover:bg-blue-800 font-bold px-6 py-2 my-6 text-white px-2 rounded"
                    >
                    Setup Repository
                    </button>
            </div>
          </div>

    
        </div>
            </div>
    </div>
  )
}

export default NewWelcome