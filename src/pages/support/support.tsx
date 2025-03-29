import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedContainer from "../../components/AnimatedContainer";
import CirclePattern from "../../components/CirclePattern";
import Footer from "../../components/Footer";
import Navbar from "../../components/users/Navbar";
import { Input } from "../../components/ui/input";
import { Toast } from "primereact/toast";
import { MeteorsCard } from "../../components/MeteorsCard";
import { useAuth } from "../../contexts/AuthContext";
import { ApiClient } from "../../config/ApiClient";

const SupportPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [name, setName] = useState(
    user ? `${user.first_name} ${user.last_name}` : ""
  );
  const [email, setEmail] = useState(user ? user.email : "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [issueType, setIssueType] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!name || !email || !subject || !message || !issueType) {
      toast.current?.show({
        severity: "error",
        summary: t("common.states.error"),
        detail: t("users.support.contactForm.required"),
        life: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await ApiClient.post("/support", {
        name,
        email,
        subject,
        message,
        issueType,
      });

      // Clear form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIssueType("");

      toast.current?.show({
        severity: "success",
        summary: t("common.states.success"),
        detail: t("users.support.contactForm.success"),
        life: 3000,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.current?.show({
        severity: "error",
        summary: t("common.states.error"),
        detail: t("users.support.contactForm.error"),
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-20">
      <Toast ref={toast} />
      <AnimatedContainer>
        <div className="absolute top-0 inset-x-0 h-[45rem] lg:h-[42rem] shadow-black-card bg-main-gradient overflow-hidden">
          <CirclePattern className="absolute -bottom-[135%] md:-bottom-[115%] -right-[40rem] w-[82rem]" />
        </div>
        <div className="container relative">
          <div className="h-full relative">
            <Navbar className="relative" />
            <div className="p-6 mt-10 md:p-12 rounded-2xl lg:rounded-4xl bg-white/5 backdrop-blur-[48px] md:max-w-[calc(100%-3rem)] lg:max-w-none mx-auto shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]">
              <div className="py-6 border-b border-white/12">
                <h1 className="text-4xl font-bold text-surface-0">
                  {t("users.support.title")}
                </h1>
                <p className="text-xl text-white/64 mt-4">
                  {t("users.support.description")}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
                {/* Left column: Support options */}
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-semibold text-surface-0 mb-4">
                      {t("users.support.helpCenter")}
                    </h2>
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm">
                        <h3 className="text-xl font-medium text-amber-500 mb-2">
                          {t("users.support.communitySupport")}
                        </h3>
                        <p className="text-white/70 mb-4">
                          {t("users.support.communityDesc")}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <a
                            href="https://github.com/AlgoHive-Coding-Puzzles/AlgoHive-Client/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700 rounded-xl text-white transition-colors"
                          >
                            {t("users.support.github")}
                          </a>
                          <a
                            href="https://github.com/AlgoHive-Coding-Puzzles/BeeLine"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700 rounded-xl text-white transition-colors"
                          >
                            {t("users.support.createPuzzles")}
                          </a>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm">
                        <h3 className="text-xl font-medium text-amber-500 mb-2">
                          {t("users.support.documentation")}
                        </h3>
                        <p className="text-white/70 mb-4">
                          {t("users.support.documentationDesc")}
                        </p>
                        <a
                          href="https://github.com/AlgoHive-Coding-Puzzles"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-amber-700/60 hover:bg-amber-600 rounded-xl text-white inline-block transition-colors"
                        >
                          {t("users.support.docs")}
                        </a>
                      </div>

                      <MeteorsCard>
                        <h3 className="text-xl font-medium text-amber-500 mb-2 relative z-10">
                          {t("users.support.faq")}
                        </h3>
                        <p className="text-white/70 mb-4 relative z-10">
                          {t("users.howToPlay.faq.desc")}
                        </p>
                        <a
                          href="/how-to-play"
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white inline-block transition-colors relative z-10"
                        >
                          {t("users.menus.howToPlay")}
                        </a>
                      </MeteorsCard>
                    </div>
                  </div>
                </div>

                {/* Right column: Contact form */}
                <div>
                  <h2 className="text-2xl font-semibold text-surface-0 mb-4">
                    {t("users.support.contactUs")}
                  </h2>
                  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm">
                    <h3 className="text-xl font-medium text-amber-500 mb-4">
                      {t("users.support.reportIssue")}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-white/90 mb-1"
                        >
                          {t("users.support.contactForm.name")}
                        </label>
                        <Input
                          id="name"
                          className="w-full px-4 py-2"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-white/90 mb-1"
                        >
                          {t("users.support.contactForm.email")}
                        </label>
                        <Input
                          id="email"
                          type="email"
                          className="w-full px-4 py-2"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="issueType"
                          className="block text-sm font-medium text-white/90 mb-1"
                        >
                          {t("users.support.issueTypes.title")}
                        </label>
                        <select
                          id="issueType"
                          className="w-full px-4 py-2 rounded-md bg-black/40 text-white border border-white/20 focus:border-amber-500 focus:ring focus:ring-amber-500/20 outline-none"
                          value={issueType}
                          onChange={(e) => setIssueType(e.target.value)}
                        >
                          <option value="" disabled>
                            {t("users.support.issueTypes.placeholder")}
                          </option>
                          <option value="technical">
                            {t("users.support.issueTypes.technical")}
                          </option>
                          <option value="account">
                            {t("users.support.issueTypes.account")}
                          </option>
                          <option value="puzzle">
                            {t("users.support.issueTypes.puzzle")}
                          </option>
                          <option value="suggestion">
                            {t("users.support.issueTypes.suggestion")}
                          </option>
                          <option value="other">
                            {t("users.support.issueTypes.other")}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-white/90 mb-1"
                        >
                          {t("users.support.contactForm.subject")}
                        </label>
                        <Input
                          id="subject"
                          className="w-full px-4 py-2"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-white/90 mb-1"
                        >
                          {t("users.support.contactForm.message")}
                        </label>
                        <textarea
                          id="message"
                          className="w-full px-4 py-2 rounded-md bg-black/40 text-white border border-white/20 focus:border-amber-500 focus:ring focus:ring-amber-500/20 outline-none min-h-[150px]"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full px-5 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                              {t("common.states.loading")}
                            </div>
                          ) : (
                            t("users.support.contactForm.send")
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-sm shadow-sm">
                    <h3 className="text-xl font-medium text-amber-500 mb-2">
                      {t("users.support.directSupport")}
                    </h3>
                    <p className="text-white/70">
                      {t("users.support.directSupportDesc")}
                    </p>
                    <div className="mt-4 p-4 bg-black/20 rounded-xl">
                      <p className="text-white font-mono">
                        ericphlpp@proton.me
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      <Footer />
    </div>
  );
};

export default SupportPage;
