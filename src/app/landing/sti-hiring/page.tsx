import LandingNav from "../components/LandingNav";
import { CheckCircle, ArrowUpRight,  Mail, MapPin, Phone } from "lucide-react";
import Footer from "../components/Footer";

export default function hiring() {
    return (
      <div >
        <div className="relative min-h-screen bg-[#5d4ab1] text-white">
        <LandingNav/>        
        <div className="relative bg-[#5D4AB1] text-white py-16 px-8 flex flex-col md:flex-row items-center md:items-start min-h-screen">
            {/* Left Content */}
            <div className="md:w-1/2 space-y-6 flex flex-col justify-center">
                <h2 className="text-8xl font-bold">Grow your career with STI</h2>
                <h3 className="text-8xl font-semibold text-yellow-400">We're Hiring</h3>
                <p className="text-sm md:text-base text-gray-200 max-w-lg">
                At STI, the opportunities for career growth are many and wide-ranging. If you're talented, proactive, and excited about having a fulfilling career in a global company with ambitious and attainable goals, we look forward to hearing from you.
                </p>
            </div>
            
            {/* Right Side*/}
            <div className="md:w-1/2 mt-8 md:mt-9 flex justify-center">
                <div className="w-[500px] h-[500px] bg-gray-300 rounded-full overflow-hidden mr-[-90px]">
                    <img src="https://www.sti.edu/uploads/Scope_Landscape_2024.webp" alt="Hero" className="w-full h-full object-cover" />
                </div>
            </div>           
        </div>

        {/* Wave Divider */}
        <div className="-bottom-10 left-0 w-full z-[0]">
            <svg viewBox="0 0 1440 320" className="w-full h-auto">
            <path 
                fill="white" 
                d="M0,224C120,202,240,160,360,154.7C480,149,600,171,720,186.7C840,202,960,210,1080,197.3C1200,185,1320,139,1380,117.3L1440,96V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
            ></path>
            </svg>
        </div>
        </div>
        <br />
        
          {/*PART 2*/}
        <div className="bg-gray-100 p-10 rounded-lg shadow-lg max-w-6xl mx-auto ">
            <h2 className="text-3xl font-bold text-gray-900">Innovation and Excellence About STI College</h2>
            <p className="text-gray-600 mt-2">STI College boasts skilled faculty dedicated to industry-driven education</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Card 1 */}
              <div className="bg-white rounded-lg p-8 shadow-md flex flex-col h-200">
                <img src="https://www.sti.edu/cms/images/events/2019/stamesa/front_306x191.jpg" alt="STI Campus" className="rounded-md" />
                <h3 className="font-semibold mt-4">Experience the Beauty of STI Campuses</h3>
                <p className="text-gray-600 text-sm mt-2">STI campuses offer a modern, vibrant environment with state-of-the-art facilities and inspiring spaces for learning and growth.</p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-blue-100 rounded-lg p-4 shadow-md h-40">
                <h3 className="font-semibold">Experience the Beauty of STI Campuses</h3>
                <p className="text-gray-700 text-sm mt-2">STI's dedicated faculty provides expert guidance and real-world learning to shape future professionals.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-yellow-100 rounded-lg p-4 shadow-md flex flex-col">
                <h3 className="font-semibold">STI’s Legacy of Excellence in Competitions</h3>
                <p className="text-gray-700 text-sm mt-2">STI consistently excels in competitions, showcasing student talent and expertise.</p>
                <img src="http://portal.sticaloocan.edu.ph/assets/images/tourism.jpg" alt="Competition" className="rounded-md mt-4" />
              </div>
              
              {/* Card 4 */}
              <div className="bg-white rounded-lg p-4 shadow-md flex flex-col">
                <img src="https://cstr.edu.ph/wp-content/uploads/2023/07/2-1-1024x969.jpeg" alt="Industry Curriculum" className="rounded-md" />
                <h3 className="font-semibold mt-4">Industry-Driven Curriculum</h3>
                <p className="text-gray-600 text-sm mt-2">STI's programs are designed to meet real-world industry demands, ensuring students graduate job-ready.</p>
              </div>

              {/* Card 5 */}
              <div className="bg-gray-200 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold">Nationwide Network</h3>
                <p className="text-gray-700 text-sm mt-2">With multiple campuses and a strong alumni community, STI provides valuable connections for career growth.</p>
              </div>
            </div>
        </div>  

        {/*PART 3*/}
        
        <section className="text-center py-12 bg-white">
          <h2 className="text-3xl font-semibold text-gray-900">Ideal Candidates for Our Team</h2>
          <p className="text-gray-600 mt-2 mb-8">
            Below are the key skill sets and qualifications we value in our ideal candidates
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 px-4 md:px-12">
            {[
              { title: "Dedication", text: "Committed to learning, teaching, and personal growth" },
              { title: "Integrity", text: "Upholds honesty, responsibility, and strong moral values" },
              { title: "Commitment to Excellence", text: "Strives for high academic and professional standards" }
            ].map((item, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl p-6 shadow-lg flex-1 min-w-[250px] h-64">
                <div className="flex items-center justify-center w-10 h-10 mb-4  rounded-full shadow-md mx-auto">
                <CheckCircle className="w-6 h-6 text-gray-700" /> 
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/*Part 4*/}
        <section className="text-center py-12 bg-white">
          <h2 className="text-3xl font-semibold text-gray-900">
            Explore <span className="text-blue-600">Career Opportunities</span>
          </h2>
          <p className="text-gray-600 mt-2 mb-8">
            Discover available positions and take the next step in your career with us
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-12">
            {[
              { title: "Academic Content Developer for Business Management", image: "https://e7savv55ofr.exactdn.com/wp-content/uploads/2014/04/AdobeStock_236629968.jpeg?strip=all&lossy=1&resize=715%2C477&ssl=1" },
              { title: "Software Developer", image: "https://cms-assets.tutsplus.com/cdn-cgi/image/width=600/uploads/users/769/posts/13950/preview_image/web_developer_coding_computer_language_2021_09_24_02_51_51_utc.jpg" },
              { title: "Corporate Finance Manager", image: "https://media.licdn.com/dms/image/v2/D5612AQGXXlGEOdgu_A/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1700677622356?e=1747872000&v=beta&t=6ng62U6cS35j-9nSTZTDtLWa5P_Qioy2bPOB2vVCIHk" },
              { title: "Welfare Guidance Counselor", image: "https://media.istockphoto.com/id/1386085818/photo/female-guidance-counselor-has-good-news-for-teen-students.jpg?s=612x612&w=0&k=20&c=JP5gU5beUAvBXTxCO6hm2Or3GRAOH-rwicV0pUunlVE=" }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-80">
                <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
                <div className="p-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <ArrowUpRight className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/*Part 5*/}
        
        <section className="text-center py-12 bg-white">
          <h2 className="text-3xl font-semibold text-gray-900">Benefits & Perks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-12 mt-8">
            {[
              {
                title: "Work-Life Balance",
                description: [
                  "Flexible work schedules and remote work options (if applicable).",
                  "Paid time off, holidays, and leave benefits.",
                  "Supportive and healthy work environment."
                ],
                bgColor: "bg-white",
                textColor: "text-blue-600"
              },
              {
                title: "Growth & Development",
                description: [
                  "Access to training programs, workshops, and certifications.",
                  "Career advancement opportunities within the organization.",
                  "Mentorship and guidance from industry experts."
                ],
                bgColor: "bg-blue-950",
                textColor: "text-yellow-400 text-white",
                descTextColor: "text-white"
              },
              {
                title: "Competitive Benefits",
                description: [
                  "Competitive salary with performance-based incentives.",
                  "Health benefits, insurance coverage, and wellness programs.",
                  "Employee recognition programs and rewards for achievements."
                ],
                bgColor: "bg-white",
                textColor: "text-blue-600"
              }
            ].map((item, index) => (
              <div key={index} className={`${item.bgColor} rounded-2xl shadow-lg p-6 flex flex-col h-80 border border-gray-200`}>
                <h3 className={`text-lg font-semibold ${item.textColor}`}>{item.title}</h3>
                <div className="border-t-2 border-gray-300 my-3"></div>
                <ul className={`${item.descTextColor || "text-gray-700"} flex-grow`}>
                  {item.description.map((point, i) => (
                    <li key={i} className="mb-2 flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <Footer/>
        

      </div> 
    );
  }
  