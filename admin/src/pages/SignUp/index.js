import {useContext, useEffect, useState} from "react";
import {MyContext} from "../../App";
import pattern from "../../assets/pattern.webp";
import {Link} from "react-router-dom";
import Logo from "../../assets/JWlogo.png";
import {MdEmail} from "react-icons/md";
import {RiLockPasswordFill} from "react-icons/ri";
import Button from "@mui/material/Button";
import googleIcon from "../../assets/googleIcon.png";
import {FaUserCircle} from "react-icons/fa";
import {IoShieldCheckmarkSharp} from "react-icons/io5";
import {Checkbox, FormControlLabel} from "@mui/material";
import {IoMdHome} from "react-icons/io";

const SignUp=() =>{
    const [inputIndex, setInputIndex] = useState(null);
    const context = useContext(MyContext);

    useEffect( ()=>{
        context.setIsHideSidebarAndHeader(true);
    },[])

    const focusInput = (index) => {
        setInputIndex(index);
    }

    return (
        <>
            <img src={pattern} className="loginPatern" />
            <section className="loginSection signUpSection">
                
                <div className="row">
                    <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
                        <h1>
                            JERSEY WORLD{" "}
                            <span className="text-sky">DASHBOARD</span> & ADMIN
                            PANEL
                        </h1>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting
                            industry. Lorem Ipsum has been the industry's standard dummy text
                            ever since the 1500s, when an unknown printer took a galley of
                            type and scrambled it to make a type specimen book. It has
                            survived not only five centuries
                        </p>

                        <div className="w-100 mt-4">
                            <Link to={"/"}>
                                {" "}
                                <Button className="btn-blue btn-lg btn-big">
                                    <IoMdHome /> Go To Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-4 pr-0">
                        <div className="loginBox">
                            <div className="logo text-center">
                                <Link to="/dashboard" ><img src={Logo} width="60px"/></Link>
                                <h5 className="font-weight-bold">Register a new account</h5>
                            </div>

                            <div className="wrapper mt-3 card border p-4">
                                <form>

                                    <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus' }`}>
                                        <span className="icon"><FaUserCircle /></span>
                                        <input type="text" className="form-control" id="name" placeholder="Enter your Name"
                                               onFocus={()=>{
                                                   focusInput(0);
                                               } }
                                               onBlur={()=>setInputIndex(null)}/>
                                    </div>
                                    <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus' }`}>
                                        <span className="icon"><MdEmail /></span>
                                        <input type="email" className="form-control" id="email" placeholder="Enter your Email"
                                               onFocus={()=>{
                                                   focusInput(1);
                                               } }
                                               onBlur={()=>setInputIndex(null)}/>
                                    </div>
                                    
                                    <div className={`form-group mb-3 position-relative ${inputIndex === 2 && 'focus' }`}>
                                        <span className="icon"><RiLockPasswordFill /></span>
                                        <input type="password" className="form-control" id="password" placeholder="Enter your password"
                                               onFocus={()=>{
                                                   focusInput(2);
                                               } }
                                               onBlur={()=>setInputIndex(null)}/>
                                    </div>
                                    <div className={`form-group mb-3 position-relative ${inputIndex === 3 && 'focus' }`}>
                                        <span className="icon"><IoShieldCheckmarkSharp /></span>
                                        <input type="password" className="form-control" id="confirm_password" placeholder="Confirm your password"
                                               onFocus={()=>{
                                                   focusInput(3);
                                               } }
                                               onBlur={()=>setInputIndex(null)}/>
                                    </div>
                                    {
                                         <FormControlLabel
                                           control={<Checkbox />}
                                           label="I agree to the all Terms & Condiotions"
                                        />
                                    }
                                    <div className="form-group">
                                        <Button className="btn-lg btn-blue w-100">Sign Up</Button>
                                    </div>

                                    <div className="form-group text-center mb-0">
                                        
                                        <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                                            <span className="line"></span>
                                            <span className="txt">or</span>
                                            <span className="line"></span>
                                        </div>

                                        <Button
                                            variant="contained"
                                            className="w-100 btn-lg btn-big loginWithGoogle"
                                        >
                                            <img src={googleIcon} width="25px" /> &nbsp; Sign In with
                                            Google
                                        </Button>
                                    </div>


                                </form>

                            </div>

                            <div className="wrapper mt-3 card border footer p-3">
              <span className="text-center">
                Already have an account?
                <Link to={"/login"} className="link color ml-2">
                    Sign In
                </Link>
              </span>
                            </div>
                        </div>
                    </div>
                </div>
               

            </section>
        </>
    )
}

export default SignUp;