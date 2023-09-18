import React, { useState, useEffect, useContext, useRef } from "react";
import Loader from "./Loader/Loader";
import { callAPI } from "./api";
import SearchContext from "./context/SearchContext";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const {
      searchTerm,setSearchTerm,
      isLoading,setIsLoading,
      results,setResults,
    } = useContext(SearchContext);

  const loadingRingRef = useRef(null);


  useEffect(() => {
      if (isLoading && loadingRingRef.current) {
        loadingRingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, [isLoading]);


  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [clarifyingQuestions, setClarifyingQuestions] = useState("");
  const [spec, setSpec] = useState("");
  const [userClarifyingAnswers, setUserClarifyingAnswers] = useState("");

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const body = JSON.stringify({ prompt: prompt });

    try {
      console.log(body);
      const response = await callAPI("/api/new_project", {
        method: "POST",
        body: body,
      });
      console.log(response);
      setClarifyingQuestions(response);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (event) => {
    console.log("Setting Answer for Q")
    setUserClarifyingAnswers(event.target.value);
  };

  const handleClarifyingQuestionsSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Prepare the data to be sent in the API request
    const body = JSON.stringify({
      prompt: prompt,
      clarifyingQuestions: clarifyingQuestions, // Include clarifying questions
      userClarifyingAnswers: userClarifyingAnswers, // Include user answers
    });

    try {
      console.log(body);
      const response = await callAPI("/api/create_project_with_clarity", {
        method: "POST",
        body: body,
      });
      console.log(response);
      // Assuming the API returns a response containing the results
      setSpec(response); // Set the results in your SearchContext
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleProceedClick = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSearchTerm(spec);
    try {
      const response = await callAPI("/api/create_project_with_spec", {
        method: "POST",
        body: JSON.stringify({
          spec:spec,
        }),
      });
      console.log(response);
      setSearchTerm(spec);
      setResults(response);
      navigate("/create");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-10">
        <a href="https://www.freepik.com/free-vector/business-idea-concept-with-people_5949651.htm#query=idea&position=2&from_view=keyword&track=sph">
          <img src='https://i.postimg.cc/K8fCt5bh/3081627.jpg' alt="start" className="h-[28vh] w-[42vh] mx-auto"/>
        </a>
      <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl ">
        Create your project in just few steps
      </h1>
      <p className="mb-6 p-1 text-lg font-normal text-gray-500 lg:text-xl ">
        Describe your project. AI will ask clarifying questions next
      </p>
      <form onSubmit={handleSubmit}>
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
          <div className="px-4 py-2 bg-white rounded-t-lg ">
            <label for="comment" className="sr-only">
              Your Project
            </label>
            <textarea
              onChange={handlePromptChange}
              id="comment"
              rows="10"
              className="w-full px-2 text-sm text-gray-900 bg-white border-0 focus:ring-0 "
              placeholder="Describe your goal..."
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t ">
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      {clarifyingQuestions.length > 0 && (
        <div>
          <h1 className="mt-10 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl ">
            Clarifying Questions:
          </h1>
          <p className="whitespace-pre-line p-5">{clarifyingQuestions}</p>
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
              <div className="px-4 py-2 bg-white rounded-t-lg ">
                <label className="sr-only">
                  Created an instruction set to create your project
                </label>
                <textarea
                  onChange={handleAnswerChange}
                  className="w-full px-2 text-sm text-gray-900 bg-white border-0 focus:ring-0"
                  rows="10"
                  placeholder="Add clarifying answers here"
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t ">
                <button
                  onClick={handleClarifyingQuestionsSubmit}
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                >
                  Submit
                </button>
              </div>
            </div>
        </div>
      )}
      {spec.length > 0 && (
                  <div>
                    <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl ">
                      Spec:
                    </h1>
                    <p className="whitespace-pre-line p-5">{spec}</p>
                    <button
                      onClick={handleProceedClick}
                      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                    >
                      Proceed
                    </button>
                  </div>
                )}
      {isLoading && <div className="p-5"> <Loader dontLog="true" /> </div>}
      <div className="spacer" ref={loadingRingRef}></div>

    </div>
  );
}

export default CreateProject;