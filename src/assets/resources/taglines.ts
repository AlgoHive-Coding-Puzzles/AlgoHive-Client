export const TAG_LINES = [
  "{:year {year}}",
  "y({year})",
  "$year={year}",
  "{'year':{year}}",
  "//{year}",
  "0.0.0.0:{year}",
  "0x{year}",
];

export const getTagLine = (): string => {
  const randomIndex = Math.floor(Math.random() * TAG_LINES.length);
  return TAG_LINES[randomIndex].replace(
    "{year}",
    new Date().getFullYear().toString()
  );
};
