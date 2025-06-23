import Logo from '../../assets/JWlogo.png'
import {useContext, useEffect, useState} from "react";
import { MyContext } from '../../App'
import pattern from '../../assets/pattern.webp';
import {MdEmail} from "react-icons/md";
import {RiLockPasswordFill} from "react-icons/ri";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import googleIcon from "../../assets/googleIcon.png";

const Login = () => {
    
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
        <section className="loginSection">
            <div className="loginBox">
                <div className="logo text-center">
                    <Link to="/dashboard" ><img src={Logo} width="60px"/></Link>
                    <h5 className="font-weight-bold">Login to Jersey World</h5>
                </div>
                
                <div className="wrapper mt-3 card border p-4">
                    <form>
                        <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus' }`}>
                            <span className="icon"><MdEmail /></span>
                            <input type="email" className="form-control" id="email" placeholder="Enter your Email" 
                            onFocus={()=>{
                                focusInput(0);
                            } }
                            onBlur={()=>setInputIndex(null)}/>
                        </div>

                        <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus' }`}>
                            <span className="icon"><RiLockPasswordFill /></span>
                            <input type="password" className="form-control" id="password" placeholder="Enter your password"
                                   onFocus={()=>{
                                       focusInput(1);
                                   } }
                                   onBlur={()=>setInputIndex(null)}/>
                        </div> 
                        
                        <div className="form-group">
                            <Button className="btn-lg btn-blue w-100">Sign In</Button>
                        </div>

                        <div className="form-group text-center mb-0">
                            <Link to={"/forgot-password"} className="link">
                                FORGOT PASSWORD
                            </Link>
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
                Don't have an account?
                <Link to={"/signUp"} className="link color ml-2">
                    Register
                </Link>
              </span>
                </div>
            </div>
            
        </section>
    </>
            )
}

export default Login;