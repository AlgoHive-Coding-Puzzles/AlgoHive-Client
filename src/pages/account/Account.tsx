import AnimatedContainer from "../../components/AnimatedContainer";
import CirclePattern from "../../components/CirclePattern";
import { Input } from "../../components/ui/input";
import Navbar from "../../components/users/Navbar";
import { useAuth } from "../../contexts/AuthContext";

const AccountPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="mb-20">
      <AnimatedContainer>
        <div className="absolute top-0 inset-x-0 h-[45rem] lg:h-[42rem] shadow-black-card bg-main-gradient overflow-hidden">
          <CirclePattern className="absolute -bottom-[135%] md:-bottom-[115%] -right-[40rem] w-[82rem]" />
        </div>
        <div className="container relative">
          <div className=" h-full relative ">
            <Navbar className="relative" />
            <div className="p-6 mt-10 md:p-12 rounded-2.5xl lg:rounded-4xl bg-white/5 backdrop-blur-[48px] max-w-[calc(100%-3rem)] lg:max-w-none mx-auto shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]">
              <div className="py-10 border-b border-white/12 flex flex-col gap-10">
                <div className="flex flex-col sm:flex-row gap-2 items-start">
                  <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
                    <button
                      className="button-regular px-5 py-3 min-w-40 bg-red-900 hover:bg-red-800 text-surface-0 font-medium rounded-2xl"
                      onClick={() => {
                        logout();
                        window.location.href = "/";
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-start">
                  <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
                    First Name
                  </div>
                  <div className="sm:flex-[0.55] w-full">
                    <Input
                      className="w-full px-5 py-3"
                      placeholder="Username"
                      value={user?.firstname}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-start">
                  <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
                    Last Name
                  </div>
                  <div className="sm:flex-[0.55] w-full">
                    <Input
                      className="w-full px-5 py-3"
                      placeholder="Username"
                      value={user?.lastname}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-start">
                  <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
                    Email
                  </div>
                  <div className="sm:flex-[0.55] w-full">
                    <Input
                      className="w-full px-5 py-3"
                      placeholder="email@this.com"
                      value={user?.email}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="py-10 border-b border-white/12 flex flex-col gap-10">
                <div className="flex flex-col sm:flex-row gap-2 items-start">
                  <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
                    Change Password
                  </div>
                  <div className="sm:flex-[0.55] w-full">
                    <Input
                      className="w-full px-5 py-3"
                      type="password"
                      placeholder="*******"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-start">
                  <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
                    Enter Password Again
                  </div>
                  <div className="sm:flex-[0.55] w-full">
                    <Input
                      className="w-full px-5 py-3"
                      type="password"
                      placeholder="*******"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-start">
                  <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
                    Enter Current Password
                  </div>
                  <div className="sm:flex-[0.55] w-full">
                    <Input
                      className="w-full px-5 py-3"
                      type="password"
                      placeholder="*******"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-10 flex justify-end">
                <button className="button-regular px-5 py-3 min-w-40 bg-amber-700 hover:bg-amber-800 text-surface-0 font-medium rounded-2xl">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default AccountPage;
