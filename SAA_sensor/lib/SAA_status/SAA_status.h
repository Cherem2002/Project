enum Status
{
  STANDALONE_STATUS,
  ERROR_STATUS,
  NOT_FOUND_STATUS,
  INELIGIBLE_STATUS,
  DUPLICATE_STATUS,
  LATE_STATUS,
  SUCESS_STATUS,
  OFFLINE_STATUS,
  STATUS_COUNT
};

const char *STATUS_STRINGS[STATUS_COUNT] = {
    "standalone"
    "error",
    "not found",
    "ineligible",
    "duplicate",
    "late",
    "success",
    "offline"};