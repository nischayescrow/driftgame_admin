import { useState, type ReactNode } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiUsers } from "react-icons/hi";
import { IoGameController } from "react-icons/io5";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { removeUser } from "../../features/user/user.slice";
import { logout } from "../../features/auth/services/auth.service";
import { startLoading, stopLoading } from "../common/loader/loader.slice";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [openSideBar, setOpenSideBar] = useState(true);
  const [gameAccord, setGameAccord] = useState(true);
  const [userMenu, setUserMenu] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const gameAccPaths = ["/gamemodes", "/playerlevels", "/cars"];

  const openUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenu(event.currentTarget);
  };
  const closeUserMenu = () => {
    setUserMenu(null);
  };

  const toggleSideBar = () => {
    setOpenSideBar((prev) => {
      if (!prev) {
        setTimeout(() => setGameAccord(true), 300);
      } else {
        setGameAccord(false);
      }

      return !prev;
    });
  };

  const handleDefaultSearch = () => {};
  const handleLogout = async () => {
    dispatch(startLoading());
    const logoutRes = await logout();
    setTimeout(() => dispatch(stopLoading()), 500);
    // console.log("logoutRes: ", logoutRes);

    if (logoutRes && logoutRes.status === 200) {
      closeUserMenu();
      dispatch(removeUser());
      navigate("/", { replace: true });
    }
  };

  return (
    <div className={`flex-1 flex overflow-y-auto`}>
      {/* Sidebar */}
      <div className="border-r border-r-slate-200 flex flex-col">
        {/* Logo */}
        <div
          className="h-17 border-b border-b-slate-200 flex justify-center items-center overflow-hidden"
          style={{
            width: openSideBar ? "auto" : "64px",
            transition: "width 0.5s ease",
          }}
        >
          {openSideBar ? (
            <p className="font-bold text-2xl text-center">DriftKing</p>
          ) : (
            <p className="font-bold text-2xl text-center">DK</p>
          )}
        </div>

        {/* Links */}
        <div
          className={`flex-1 overflow-y-auto ${openSideBar ? "p-4" : "px-3 py-4"}`}
          style={{
            width: openSideBar ? "255px" : "64px",
            transition: "width 0.5s ease-in-out",
          }}
        >
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `w-full p-2 flex gap-2 items-center ${isActive ? "bg-primary text-white" : "text-black"} rounded-md text-sm 
                font-semibold`
                }
              >
                <LuLayoutDashboard
                  className="text-xl min-w-5 min-h-5"
                  style={{
                    width: openSideBar ? "20px" : "24px",
                    height: openSideBar ? "20px" : "24px",
                  }}
                />
                {openSideBar && <span>Dashboard</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `w-full p-2 flex gap-2 items-center ${isActive ? "bg-primary text-white" : "text-black"} rounded-md text-sm 
                font-semibold`
                }
              >
                <HiUsers
                  className="text-xl min-w-5 min-h-5"
                  style={{
                    width: openSideBar ? "20px" : "24px",
                    height: openSideBar ? "20px" : "24px",
                  }}
                />
                {openSideBar && <span>Users</span>}
              </NavLink>
            </li>

            <li>
              <Accordion
                defaultExpanded
                expanded={gameAccord}
                sx={{
                  "&.MuiAccordion-root": {
                    boxShadow: "none",
                  },
                  "& .MuiAccordionSummary-root": {
                    padding: "0 8px",
                    minHeight: 36,
                    maxHeight: 40,
                    borderRadius: "4px",
                    bgcolor:
                      !openSideBar && gameAccPaths.includes(location.pathname)
                        ? "#405189"
                        : "white",
                    color: !openSideBar ? "white" : "black",
                  },
                  "& .MuiAccordionDetails-root": {
                    padding: "0 10px",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={openSideBar ? <ExpandMoreIcon /> : <></>}
                  onClick={() => {
                    if (!openSideBar) toggleSideBar();
                    else setGameAccord((prev) => !prev);
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <IoGameController
                      className="text-xl min-w-5 min-h-5"
                      style={{
                        width: openSideBar ? "20px" : "24px",
                        height: openSideBar ? "20px" : "24px",
                      }}
                    />
                    {openSideBar && <span>Game</span>}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className="flex flex-col gap-y-1.5">
                    {/* Cars */}
                    <li>
                      <NavLink
                        to="/cars"
                        className={({ isActive }) =>
                          `w-full p-2 flex gap-2 items-center ${isActive ? "bg-primary text-white" : "text-black"} rounded-md text-sm font-semibold`
                        }
                      >
                        {openSideBar && <span>Cars</span>}
                      </NavLink>
                    </li>

                    {/* Game modes */}
                    <li>
                      <NavLink
                        to="/gamemodes"
                        className={({ isActive }) =>
                          `w-full p-2 flex gap-2 items-center ${isActive ? "bg-primary text-white" : "text-black"} rounded-md text-sm font-semibold`
                        }
                      >
                        {openSideBar && <span>Modes</span>}
                      </NavLink>
                    </li>

                    {/* Player levels */}
                    <li>
                      <NavLink
                        to="/playerlevels"
                        className={({ isActive }) =>
                          `w-full p-2 flex gap-2 items-center ${isActive ? "bg-primary text-white" : "text-black"} rounded-md text-sm font-semibold`
                        }
                      >
                        {openSideBar && <span>Player Levels</span>}
                      </NavLink>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>
            </li>
          </ul>
        </div>
      </div>
      {/* Dashboard main */}
      <div className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Navbar */}
        <div
          className="sticky top-0 right-0 left-0 z-10 bg-white  min-h-17 max-h-17 flex justify-between px-4 border-b 
        border-b-slate-200"
        >
          {/* Search */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 rounded-sm cursor-pointer text-2xl hover:scale-110"
              onClick={toggleSideBar}
            >
              {openSideBar ? <RxHamburgerMenu /> : <GoArrowRight />}
            </button>

            <form>
              <div className="">
                <div className="relative">
                  <input
                    type="text"
                    onChange={handleDefaultSearch}
                    className=" border border-slate-200 rounded-sm p-1.5 px-10 w-sm placeholder:font-semibold placeholder:text-sm"
                    placeholder="Search..."
                  />

                  <button
                    type="button"
                    className="h-full px-2.5 rounded-sm absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-105"
                  >
                    <IoSearch className="text-lg" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* User dropdown */}
          <div className="">
            <button
              type="button"
              id="basic-button"
              aria-controls={Boolean(userMenu) ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(userMenu) ? "true" : undefined}
              onClick={openUserMenu}
              className="h-full px-2 cursor-pointer flex items-center gap-2 text-sm"
            >
              <Avatar alt="Admin photo" src="" sx={{ width: 30, height: 30 }} />
              <p className="font-semibold">Escrow</p>
              <IoIosArrowDown className="" />
            </button>
            <Menu
              id="basic-menu"
              anchorEl={userMenu}
              open={Boolean(userMenu)}
              onClose={closeUserMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>

        {children}

        <div className="min-h-17 max-h-17 flex justify-between items-center px-6 border-t border-t-slate-200">
          <p>2026 &copy; DriftKing.</p>
          <p>Developed by Escrow infotech ltd.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
