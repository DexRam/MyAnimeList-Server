const base_URL = "https://api.jikan.moe/v4/";
import db from "../dbConnector/settings";

export const userAnimeList = async (userID: number) => {
  try {
    return await db("user_animes").where({ user_id: userID }).select();
  } catch (error) {
    console.error("Error fetching user anime list:", error);
    throw error;
  }
};

export const top = async () => {
  try {
    const response = await fetch(`${base_URL}top/anime`);
    if (!response.ok) {
      throw new Error(`Failed to fetch, status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top anime:", error);
    throw error;
  }
};

export const anime = async (animeID: number) => {
  try {
    const response = await fetch(`${base_URL}anime/${animeID}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch, status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching an anime:", error);
    throw error;
  }
};

const checkExistingRecord = (userID: number, animeID: number) =>
  db("user_animes").where({ user_id: userID, anime_id: animeID }).first();

const changeAnimeStatus = async (
  userID: number,
  animeID: number,
  statusID: number
) => {
  try {
    const doRecordExists = await checkExistingRecord(userID, animeID);
    if (doRecordExists) {
      await db("user_animes")
        .where({ user_id: userID, anime_id: animeID })
        .update({ status_id: statusID });
    } else {
      const animeResult = await anime(animeID);
      await db("user_animes").insert({
        user_id: userID,
        anime_id: animeID,
        anime_title: animeResult.title,
        status_id: statusID,
      });
    }
  } catch (error) {
    console.error("Error while changing the anime status:", error);
    throw error;
  }
};

export const changeStatusToPlanned = (userID: number, animeID: number) =>
  changeAnimeStatus(userID, animeID, 1);

export const changeStatusToWatching = (userID: number, animeID: number) =>
  changeAnimeStatus(userID, animeID, 2);

export const changeStatusToWatched = (userID: number, animeID: number) =>
  changeAnimeStatus(userID, animeID, 3);
