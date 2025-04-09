import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { WebSocketClient } from "../../../../config/ApiClient";

import AnimatedContainer from "@/app/shared/components/AnimatedContainer";
import CirclePattern from "@/app/shared/components/CirclePattern";
import Navbar from "@/app/shared/components/Navbar";
import Footer from "@/app/shared/components/Footer";

import { ServiceManager } from "@services/index";

import { Try } from "@/models";

interface UserScore {
  user_id: string;
  username: string;
  group: string;
  total_score: number;
  highest_puzzle_index: number;
  highest_step: number;
  total_attempts: number;
}

interface WebSocketMessage {
  update_type: string;
  try: Try;
  id?: string; // For deduplication
}

export default function LeaderboardPage() {
  const { t } = useTranslation(["common", "leaderboard"]);
  const { competition_id } = useParams();
  const competitionId = competition_id || "";

  const [, setTries] = useState<Try[]>([]);
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [competitionName, setCompetitionName] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  // Store processed message IDs to prevent duplicates
  const processedMessages = useRef<Set<string>>(new Set());
  // Use ref to keep WebSocket instance stable across renders
  const wsRef = useRef<WebSocket | null>(null);

  // Generate a unique ID for each message based on its content
  const generateMessageId = (message: WebSocketMessage): string => {
    return `${message.update_type}-${message.try.id}-${message.try.user_id}-${message.try.attempts}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCompetitionDetails = async () => {
      try {
        const competition = await ServiceManager.competitions.fetchByID(
          competitionId
        );
        setCompetitionName(competition.title);
      } catch (error) {
        console.error("Error fetching competition details:", error);
      }
    };

    fetchCompetitionDetails();
  }, [competitionId]);

  useEffect(() => {
    const fetchTries = async () => {
      try {
        const tries = await ServiceManager.competitions.fetchLeaderboardTries(
          competitionId
        );

        setTries(tries);
        aggregateUserScores(tries);
      } catch (error) {
        console.error("Error fetching tries:", error);
      }
    };

    fetchTries();

    // Setup WebSocket connection
    const connectWebSocket = () => {
      // const ws = new WebSocket(
      //   `ws://localhost:8080/api/v1/competitions/${competitionId}/ws`
      // );

      const ws = WebSocketClient("/competitions/" + competitionId);

      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data);

        // Generate a unique ID for this message
        const messageId = generateMessageId(data);

        // Skip if we've already processed this message (prevents duplication in dev mode)
        if (processedMessages.current.has(messageId)) {
          return;
        }

        // Add to processed set
        processedMessages.current.add(messageId);

        // Clean up old message IDs after a while to prevent memory leaks
        setTimeout(() => {
          processedMessages.current.delete(messageId);
        }, 5000); // Remove after 5 seconds

        if (data.update_type === "new") {
          setTries((prevTries) => {
            const newTries = [...prevTries, data.try];
            aggregateUserScores(newTries);
            return newTries;
          });
        } else if (data.update_type === "update") {
          setTries((prevTries) => {
            const updatedTries = prevTries.map((t) =>
              t.id === data.try.id ? data.try : t
            );
            aggregateUserScores(updatedTries);
            return updatedTries;
          });
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return ws;
    };

    connectWebSocket();

    // Cleanup function to close the WebSocket connection
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [competitionId]);

  const aggregateUserScores = (triesData: Try[]) => {
    const userScoreMap = new Map<string, UserScore>();

    triesData.forEach((tryItem) => {
      const userId = tryItem.user_id;
      const username = `${tryItem.user?.first_name} ${tryItem.user?.last_name}`;
      const group =
        tryItem.user && tryItem.user?.groups
          ? tryItem.user?.groups.map((g) => g.name).join(", ")
          : "";

      if (!userScoreMap.has(userId)) {
        userScoreMap.set(userId, {
          user_id: userId,
          username,
          group,
          total_score: 0,
          highest_puzzle_index: 0,
          highest_step: 0,
          total_attempts: 0,
        });
      }

      const userScore = userScoreMap.get(userId)!;
      userScore.total_score += tryItem.score || 0;
      userScore.total_attempts += tryItem.attempts || 0;

      if (tryItem.puzzle_index > userScore.highest_puzzle_index) {
        userScore.highest_puzzle_index = tryItem.puzzle_index;
        userScore.highest_step = tryItem.step;
      } else if (
        tryItem.puzzle_index === userScore.highest_puzzle_index &&
        tryItem.step > userScore.highest_step
      ) {
        userScore.highest_step = tryItem.step;
      }
    });

    // Sort by total score (highest first)
    const sortedScores = Array.from(userScoreMap.values()).sort(
      (a, b) => b.total_score - a.total_score
    );

    setUserScores(sortedScores);
  };

  const prettyPrintScore = (score: number) => {
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (leaderboardRef.current?.requestFullscreen) {
        await leaderboardRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={leaderboardRef}
      className={`min-h-screen ${isFullscreen ? "bg-gray-900" : ""}`}
    >
      {!isFullscreen && (
        <AnimatedContainer>
          <div className="absolute top-0 inset-x-0 h-[45rem] lg:h-[42rem] shadow-black-card bg-main-gradient overflow-hidden">
            <CirclePattern className="absolute -bottom-[135%] md:-bottom-[115%] -right-[40rem] w-[82rem]" />
          </div>
          <div className="container relative">
            <div className="h-full relative">
              <Navbar className="relative" />
              <div className="p-6 mt-10 md:p-12 rounded-2xl lg:rounded-4xl bg-white/5 backdrop-blur-[48px] md:max-w-[calc(100%-3rem)] lg:max-w-none mx-auto shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]">
                {renderContent()}
              </div>
            </div>
          </div>
        </AnimatedContainer>
      )}

      {isFullscreen && (
        <div className="p-6 w-full h-screen overflow-y-auto bg-gray-900">
          <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
            <div>
              <div className="flex items-center font-bold">
                <span className="text-orange-500">Algo</span>
                <span>Hive.dev</span>
              </div>
              <p className="text-white/70 mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <h1 className="text-3xl font-bold text-white">{competitionName}</h1>
            <div className="flex flex-col">
              <span className="text-white/70 text-2xl">{time}</span>
              <div className="flex items-center">
                <i className="pi pi-check-circle text-2xl text-green-500 mr-2"></i>
                <span className="text-white/70">Connected to WebSocket</span>
              </div>
            </div>
          </div>
          {renderContent(true)}
        </div>
      )}

      {!isFullscreen && (
        <div className="mt-20">
          <Footer />
        </div>
      )}
    </div>
  );

  function renderContent(isFullscreenView = false) {
    return (
      <>
        <div
          className={`${
            !isFullscreenView ? "py-6 border-b border-white/12" : ""
          }`}
        >
          {!isFullscreenView && (
            <>
              <h1 className="text-4xl font-bold text-surface-0">
                {t("leaderboard:title")}
              </h1>
              {competitionName && (
                <p className="text-xl text-white/64 mt-4">{competitionName}</p>
              )}
            </>
          )}
        </div>

        <div className={`${isFullscreenView ? "" : "mt-8"}`}>
          <div className="overflow-x-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isFullscreen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9L4 4m0 0h5m-5 0v5M15 15l5 5m0 0h-5m5 0v-5M9 15l-5 5m0 0h5m-5 0v-5M15 9l5-5m0 0h-5m5 0v5"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
                    />
                  )}
                </svg>
                {isFullscreen
                  ? t("leaderboard:exitFullscreen")
                  : t("leaderboard:fullscreen")}
              </button>
            </div>
            <table
              className={`min-w-full bg-white/5 rounded-lg overflow-hidden ${
                isFullscreenView ? "text-lg" : ""
              }`}
            >
              <thead>
                <tr className="bg-black/40">
                  <th
                    className={`px-6 ${
                      isFullscreenView ? "py-6" : "py-4"
                    } text-left ${
                      isFullscreenView ? "text-lg" : "text-sm"
                    } font-medium text-amber-500`}
                  >
                    {t("leaderboard:rank")}
                  </th>
                  <th
                    className={`px-6 ${
                      isFullscreenView ? "py-6" : "py-4"
                    } text-left ${
                      isFullscreenView ? "text-lg" : "text-sm"
                    } font-medium text-amber-500`}
                  >
                    {t("leaderboard:user")}
                  </th>
                  <th
                    className={`px-6 ${
                      isFullscreenView ? "py-6" : "py-4"
                    } text-left ${
                      isFullscreenView ? "text-lg" : "text-sm"
                    } font-medium text-amber-500`}
                  >
                    {t("leaderboard:group")}
                  </th>
                  <th
                    className={`px-6 ${
                      isFullscreenView ? "py-6" : "py-4"
                    } text-left ${
                      isFullscreenView ? "text-lg" : "text-sm"
                    } font-medium text-amber-500`}
                  >
                    {t("leaderboard:totalScore")}
                  </th>
                  <th
                    className={`px-6 ${
                      isFullscreenView ? "py-6" : "py-4"
                    } text-left ${
                      isFullscreenView ? "text-lg" : "text-sm"
                    } font-medium text-amber-500`}
                  >
                    {t("leaderboard:currentPuzzle")}
                  </th>
                  <th
                    className={`px-6 ${
                      isFullscreenView ? "py-6" : "py-4"
                    } text-left ${
                      isFullscreenView ? "text-lg" : "text-sm"
                    } font-medium text-amber-500`}
                  >
                    {t("leaderboard:currentStep")}
                  </th>
                  <th
                    className={`px-6 ${
                      isFullscreenView ? "py-6" : "py-4"
                    } text-left ${
                      isFullscreenView ? "text-lg" : "text-sm"
                    } font-medium text-amber-500`}
                  >
                    {t("leaderboard:totalAttempts")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {userScores.map((user, index) => (
                  <tr
                    key={user.username}
                    className="hover:bg-white/10 transition-colors"
                  >
                    <td
                      className={`px-6 ${
                        isFullscreenView ? "py-6" : "py-4"
                      } whitespace-nowrap ${
                        isFullscreenView
                          ? "text-xl font-semibold"
                          : "text-sm font-medium"
                      } text-white`}
                    >
                      {index + 1}
                    </td>
                    <td
                      className={`px-6 ${
                        isFullscreenView ? "py-6" : "py-4"
                      } whitespace-nowrap ${
                        isFullscreenView ? "text-xl" : "text-sm"
                      } text-white`}
                    >
                      {user.username}
                    </td>
                    <td
                      className={`px-6 ${
                        isFullscreenView ? "py-6" : "py-4"
                      } whitespace-nowrap ${
                        isFullscreenView ? "text-xl" : "text-sm"
                      } text-white`}
                    >
                      {user.group}
                    </td>
                    <td
                      className={`px-6 ${
                        isFullscreenView ? "py-6" : "py-4"
                      } whitespace-nowrap ${
                        isFullscreenView ? "text-xl" : "text-sm"
                      } text-white`}
                    >
                      <span
                        className={`text-amber-400 font-semibold ${
                          isFullscreenView ? "text-2xl" : ""
                        }`}
                      >
                        {prettyPrintScore(user.total_score)}
                      </span>
                    </td>
                    <td
                      className={`px-6 ${
                        isFullscreenView ? "py-6" : "py-4"
                      } whitespace-nowrap ${
                        isFullscreenView ? "text-xl" : "text-sm"
                      } text-white`}
                    >
                      {user.highest_puzzle_index + 1}
                    </td>
                    <td
                      className={`px-6 ${
                        isFullscreenView ? "py-6" : "py-4"
                      } whitespace-nowrap ${
                        isFullscreenView ? "text-xl" : "text-sm"
                      } text-white`}
                    >
                      {user.highest_step}
                    </td>
                    <td
                      className={`px-6 ${
                        isFullscreenView ? "py-6" : "py-4"
                      } whitespace-nowrap ${
                        isFullscreenView ? "text-xl" : "text-sm"
                      } text-white`}
                    >
                      {user.total_attempts}
                    </td>
                  </tr>
                ))}
                {userScores.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className={`px-6 py-8 text-center text-white/70 ${
                        isFullscreenView ? "text-xl" : ""
                      }`}
                    >
                      {t("leaderboard:noEntries")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isFullscreenView && (
            <div className="mt-6">
              <a
                href={`/competitions/${competitionId}`}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors inline-block"
              >
                {t("leaderboard:backToCompetition")}
              </a>
            </div>
          )}
        </div>
      </>
    );
  }
}
