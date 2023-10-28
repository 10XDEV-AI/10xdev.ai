import React,{useEffect} from 'react';
import './landing.css';
import PublicWelcome from '../OpenSource/PublicWelcome';
import { Route } from 'react-router-dom';

const LandingPage = () => {
  const hostname = window.location.hostname;
  let redirectUri;

  if (hostname === 'localhost') {
    redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Fwelcome';
  } else if (hostname === 'test.10xdevai.com') {
    redirectUri = 'https%3A%2F%2Ftest.10xdevai.com%2Fwelcome';
  } else if (hostname === '10xdevai.com') {
    redirectUri = 'https%3A%2F%2F10xdevai.com%2Fwelcome';
  }
  useEffect(() => {
    window.localStorage.removeItem('currentuser');
    }, []);

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        console.log(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    

  return (
    <div>
    <header className="fixed w-full z-10">
        <nav className="bg-gray-50 border-gray-200 py-2.5 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
               <button className="flex items-center">
                   <span className="self-center text-4xl font-extrabold italic whitespace-nowrap dark:text-blue-500 text-blue-700">10XDEV.AI</span>
               </button>

                <div className="flex items-center lg:order-2">
                    <a href={`https://10xdevgoogleauth.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=7rj9u2ntqm57fsqeod3lmgloag&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=${redirectUri}`} className="text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-700">Get Started</a>
                </div>
                <div className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                        <li>
                           <a href={`https://near-nest-eb1.notion.site/Compare-Us-98decebde26f4135bc68b9b2139211ef?pvs=4`} className="block py-2 pl-3 pr-6 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Compare Us!</a>
                        </li>
                        <li className='px-2'>
                        </li>
                        <li>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
            <div className="place-self-center content-center text-center lg:col-span-12">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Be a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:bg-gradient-to-r dark:to-emerald-600 dark:from-sky-400">10X Developer</span> with Autonomous Software Development on your codebase</h1>
            <p className="mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Train 10XDEV.AI on your git repository for free</p>
            <div className="flex justify-center"> 
                <button type="button"  className="text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg  px-8 py-2 dark:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-700" onClick={() => scrollToSection('features')} >Try Now</button>
                <a href={`https://10xdevgoogleauth.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=7rj9u2ntqm57fsqeod3lmgloag&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=${redirectUri}`} className="py-3 px-5 mx-2 font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Add Your Repo</a>
            </div>
            </div>
            <div className="p-5 lg:mt-0 lg:col-span-12 lg:flex lg:px-20">
                <iframe className="aspect-video rounded-md bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 p-1 w-full p-1 rounded-lg lg:mb-0"  src="https://www.youtube.com/embed/4dgS96DCezE?si=kl_fx1_5psoO575u" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </div>
    </section>

    
    <section id="features" className="bg-gray-50 dark:bg-gray-800">
            <div className="max-w-screen-xl px-4 mx-auto text-center lg:py-10 lg:px-6">
                <figure className="max-w-screen-md mx-auto pt-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 mx-auto mb-3 text-gray-400 dark:text-gray-600">
                        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                    </svg>
                    <blockquote>
                        <p className="text-xl font-medium text-gray-900 md:text-2xl dark:text-white">Try it out with any of our pre-trained repositories here!</p>
                    </blockquote>
                    <figcaption className="flex items-center justify-center mt-6 ">
                        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                            <div className="px-3 font-medium text-gray-900 dark:text-white">GPT-Engineer</div>
                            <div className="px-3 text-sm font-light text-gray-500 dark:text-gray-400">
                                 <a
                                    href="https://10xdevai.com/opensource/Google-clone-reactjs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 text-sm font-light text-gray-500 dark:text-gray-400"
                                  >
                                    Google-Clone-React
                                  </a>
                            </div>
                            <div className="px-3 text-sm font-light text-gray-500 dark:text-gray-400">
                                <a href="https://10xdevai.com/opensource/Test" target="_blank" rel="noopener noreferrer" className="px-3 text-sm font-light text-gray-500 dark:text-gray-400">
                                Simple Web Project
                                </a>
                            </div>
                            <div className="px-3 text-sm font-light text-gray-500 dark:text-gray-400">
                            <a href="https://10xdevai.com/opensource/aruco_ros" target="_blank" rel="noopener noreferrer" className="px-3 text-sm font-light text-gray-500 dark:text-gray-400">
                                PAL Robotics ROS
                              </a>
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </div>
          </section>

    <section  className="bg-gray-50 dark:bg-gray-900">
      <div className="p-10">
        <div className = 'bg-white relative h-screen z-0 max-w-screen-xl mx-auto'  style={{ boxShadow: '0 0 5px #cedcee' }}>
        <PublicWelcome  projectName = 'gpt-engineer'/>
        </div>
      </div>
    </section>



    <section className="bg-white dark:bg-gray-800">
        <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:px-6">

            <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">

                <div className="text-gray-500 sm:text-lg dark:text-gray-400">
                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Train your repository into our algorithm</h2>
                    <p className="mb-8 font-light lg:text-xl">Now you can ask the AI to </p>

                    <ul role="list" className="space-y-5  border-gray-200  dark:border-gray-700">
                        <li className="flex space-x-3">
                            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">❓ Explain Code</span>
                        </li>
                        <li className="flex space-x-3">
                            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">🐞️ Fix Bugs</span>
                        </li>
                        <li className="flex space-x-3">
                            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">️⭐️ Implement New Features</span>
                        </li>
                        <li className="flex space-x-3">
                            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">🔬 Create Testcases </span>
                        </li>
                        <li className="flex space-x-3">
                            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">📖 Write Documentation </span>
                        </li>
                        <li className="flex space-x-3">
                            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">🕹️Generate commands ＆ More 🪄</span>
                        </li>
                    </ul>
                </div>
                </div>
        </div>
      </section>
    <section className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-24 lg:px-6">
            <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Designed for business teams like yours</h2>
                <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">We are building for enterprise at 10XDEV.AI. Soon AutoGPT will be used to build real word apps with complicated dependancies. Not just boilerplate code</p>
            </div>
            <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                <div className="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                    <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
                    <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best option for personal use & for your next project.</p>
                    <div className="flex items-baseline justify-center my-8">
                        <span className="mr-2 text-5xl font-extrabold">20$ </span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <ul role="list" className="mb-8 space-y-4 text-left">
                        <li className="flex items-center space-x-3">

                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>Individual configuration</span>
                        </li>
                        <li className="flex items-center space-x-3">

                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>No setup, or hidden fees</span>
                        </li>
                        <li className="flex items-center space-x-3">

                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>Team size: <span className="font-semibold">1 developer</span></span>
                        </li>
                    </ul>
                    <a href={`https://10xdevgoogleauth.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=7rj9u2ntqm57fsqeod3lmgloag&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=${redirectUri}`} className="text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-blue-900">Get started</a>
                </div>

                <div className="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                    <h3 className="mb-4 text-2xl font-semibold">Company</h3>
                    <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Relevant for multiple users, extended & premium support.</p>
                    <div className="flex items-baseline justify-center my-8">
                        <span className="mr-2 text-5xl font-extrabold">$30</span>
                        <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400">/month</span>
                    </div>
                    <ul role="list" className="mb-8 space-y-4 text-left">
                        <li className="flex items-center space-x-3">
                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>Individual configuration</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>No setup, or hidden fees</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>Team size: <span className="font-semibold">10 developers</span></span>
                        </li>
                    </ul>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSfuSBcAXtMe0CXVfQmX8gRF82zC-uCl_IZVMwk0AmwPJEksKQ/viewform" className="text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-blue-900">Contact Sales</a>
                </div>
                <div className="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                    <h3 className="mb-4 text-2xl font-semibold">Enterprise</h3>
                    <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best for large scale uses and extended redistribution rights.</p>
                    <div className="flex items-baseline justify-center my-8">
                        <span className="mr-2 text-5xl font-extrabold">$40</span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    <ul role="list" className="mb-8 space-y-4 text-left">
                        <li className="flex items-center space-x-3">
                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>Individual configuration</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>No setup, or hidden fees</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span>Team size: <span className="font-semibold">100+ developers</span></span>
                        </li>
                    </ul>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSfuSBcAXtMe0CXVfQmX8gRF82zC-uCl_IZVMwk0AmwPJEksKQ/viewform" className="text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-blue-900">Contact Sales</a>                </div>
            </div>
        </div>
      </section>

    <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
            <div className="max-w-screen-sm mx-auto text-center">
                <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">Start your free trial today</h2>
                <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">Try 10XDEV.AI today. No credit card required.</p>
                <a href={`https://10xdevgoogleauth.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=7rj9u2ntqm57fsqeod3lmgloag&response_type=token&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=${redirectUri}`} className="text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-700 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-700">Get Started</a>
            </div>
        </div>
        <div className="max-w-screen-x py-6  ">
            <div className="text-center">
                <span className="block text-sm text-center text-gray-500 dark:text-gray-400">© 2023 10XDEV.AI™. All Rights Reserved.</span>
            </div>
        </div>
    </footer>
    <script src="https://unpkg.com/flowbite@1.4.1/dist/flowbite.js"></script>
    </div>
  );
};

export default LandingPage;
