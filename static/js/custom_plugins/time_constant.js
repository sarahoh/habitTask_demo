/*
Carry over Jimmy's OT task. time constants for different trials
*/


const F_ITI = 250; // If get F wrong, wait F_ITI and present F again
const S_ITI = 250; // If get S wrong, wait S_ITI and present S again
const T_ITI = 300; // If get T wrong, wait T_ITI and present T again
const STAR_ITI = 500; // The time that star stays on the screen
const TRY_ALL_KEYS_ITI = 500; // The time that try all keys message stays on screen
const vibrate_ITI = 20;
const starAnim_ITI = 500;
const fade_ITI = 400;
const TRIAL_RT = 2000; // max allotted time for response
const COLLECT_STAR_RT = 3000; // max allotted time for collecting stars
const FtoS = 0; // The time from F to S transition, 500 originally
const StoT = 0; // The time from S to T transition, 500 originally
const trial_ITI = 500; // fixation after stage 3 to next trial's stage 1
const MAX_RT = 30000; // Max amount of time for instructions/first practice trial

const F_timeout_message_duration = 1000; // The time that timeout message stays on the screen
const F_nomorechance = 1000; // The time that no more chance message (try all possible key) stays on the screen

const S_timeout_message_duration = 1000; // The time that timeout message stays on the screen
const S_nomorechance = 1000; // The time that no more chance message (try all possible key) stays on the screen

const T_timeout_message_duration = 1000; // The time that timeout message stays on the screen
const T_nomorechance = 1000; // The time that no more chance message (try all possible key) stays on the screen

const T_star_message_duration_unlimited = 12000;
const T_star_message_duration_long = 3000;
const T_star_message_duration_short = 1500;
const T_star_message_duration_testPract = 1500;

const break_time = 20000; // Max break time between blocks

const timeparams = {
	F_ITI: F_ITI,
	S_ITI: S_ITI,
	T_ITI: T_ITI,
	FtoS: FtoS,
	StoT: StoT,
	trial_ITI: trial_ITI,
	max_RT: MAX_RT,
	F_timeout_message_duration: F_timeout_message_duration,
	F_nomorechance: F_nomorechance,
	S_timeout_message_duration: S_timeout_message_duration,
	S_nomorechance: S_nomorechance,
	T_timeout_message_duration: T_timeout_message_duration,
	T_nomorechance: T_nomorechance,
	break_time: break_time,
};

// other constants

let no_response = 0;
let no_response_threshold = 10;
let kill_check = 0;
