// maybe make a version of this with added instructions for cameron and alex

let create_block = function(maze_info,b) {

  let arm_seq = gen_arm_sequence(maze_info.num_pres_per_arm, maze_info.omit_armIdx); // this is broken
  console.log(arm_seq);

  let block_timeline = [];

  for (i = 0; i < maze_info.n_trials; i++) {

    // carryover from Jimmy's OT task, helps track whether to move on from stages

    let counter1 = 0; // count how many tries for the 1st stage (getting into maze)
    let F_succeed = 0; // boolean for whether they passed 1st stage

    let counter2 = 0; // count how many tries for the 2nd stage (getting into an arm)
    let S_succeed = 0; // boolean for whether they passed 2nd stage

    let counter3 = 0; // count how many tries for the 3rd stage (collecting reward in arm)
    let T_succeed = 0; // boolean for whether they passed 3rd stage

    let no_response = 0;

    let create_F_stim = trial => { // on_start function for generating stimuli and instructions HTML
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true,stage:3}).count();
      trial.stimulus = `<p class='points'>Points: ${pts}</p><img class='maze' img src='static/img/s1${maze_info.name}.png'/><p class='bottom'>Use the keys to enter the maze</p>`;
      trial.incorrect_text = `<p class='faded points'>Points: ${pts}</p><img class='faded maze' img src='static/img/s1${maze_info.name}.png'/>`;
    };

    let F_trial = { // trial object for first stage (entering the maze)
      type: "categorize-html",
      stimulus: `<img class='maze' img src='static/img/s1${maze_info.name}.png'/>`,
      on_start: create_F_stim, // generate HTML
      condition: maze_info.condition, // what maze this is (and if it's practice)
      block: b, // block #
      trial: i, // trial # (starts at 0)
      choices: maze_info.keys, // keys that can be pressed
      timeout_message: TIMEOUT_MSG, // message displayed when no response is made
      key_answer: maze_info.first_stage_key, // key code of correct key to press
      trial_duration: TRIAL_RT, // how long ppl have to respond
      show_stim_with_feedback: false, // not important
      correct_feedback_duration: 0,
      incorrect_feedback_duration: F_ITI,
      timeout_message_duration: F_timeout_message_duration, // how long to show TIMEOUT msg
      correct_text: "",
      incorrect_text: "",
      stage: 1, // stage
      data: { // data to save for later
        block: b,
        trial: i,
        arm: arm_seq[i],
        stage: 1,
        key_answer: maze_info.first_stage_key,
        reversed_arm: maze_info.reversed_arms.includes(arm_seq[i]),
      }
    };

    let create_S_stim = trial => { // on_start function for generating stimuli and instructions HTML
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true,stage:3}).count();
      trial.stimulus = `<p class='points'>Points: ${pts}</p><img class='maze' img src='static/img/s2.png'/><p class='bottom'>Use the keys to enter an arm</p>`;
      trial.incorrect_text = `<p class='faded points'>Points: ${pts}</p><img class='faded maze' img src='static/img/s2.png'/>`;
    };

    let S_trial = { // trial object for second stage (entering an arm)
      type: "categorize-html",
      stimulus: `<img class='maze' img src='static/img/s2.png'/>`,
      on_start: create_S_stim,
      condition: maze_info.condition,
      block: b,
      trial: i,
      choices: maze_info.keys,
      timeout_message: TIMEOUT_MSG,
      key_answer: maze_info.second_stage_key,
      trial_duration: TRIAL_RT,
      show_stim_with_feedback: false,
      correct_feedback_duration: 0,
      incorrect_feedback_duration: S_ITI,
      timeout_message_duration: S_timeout_message_duration,
      correct_text: "",
      incorrect_text: "",
      stage: 2,
      data: {
        block: b,
        trial: i,
        arm: arm_seq[i],
        stage: 2,
        key_answer: maze_info.second_stage_key,
        reversed_arm: maze_info.reversed_arms.includes(arm_seq[i]),
      }
    };

    let create_T_stim = trial => { // on_start function for setting HTML of stimuli, outcome text, key answer for this arm
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true, stage:3}).count();
      let trial_arm = arm_seq[trial.trial];
      trial.stimulus = `<p class='points'>Points: ${pts}</p><img class='maze' img src='static/img/s${trial_arm}.png'/><p class='bottom'>Use the keys to collect the reward in this arm</p>`;
      trial.correct_text = `<p class='points'>Points: ${pts+1}</p><img class='star' img src='static/img/star.png'><img class='maze' img src='static/img/s${trial_arm}.png'/>`;
      trial.incorrect_text = `<p class='faded points'>Points: ${pts}</p><img class='faded maze' img src='static/img/s${trial_arm}.png'/><p class='bottom'>Try again!</p>`;
      trial.key_answer = maze_info.third_stage_key[trial_arm-3];
      trial.data.key_answer = maze_info.third_stage_key[trial_arm-3];
    };

    let countTrialPresses = data => { // i actually don't know if it's getting set here or in the Loop function? oops
      if (data.correct)
        data.num_presses_this_trial = jsPsych.data.get().filter({block: b, trial: i}).count();
    }

    let T_trial = { // trial object for third (getting a point in arm)
      type: "categorize-html",
      stimulus: `<img class='maze' img src='static/img/s2.png'/>`,
      on_start: create_T_stim,
      on_finish: countTrialPresses, // not sure if this actually works
      condition: maze_info.condition,
      block: b,
      trial: i,
      choices: maze_info.keys,
      trial_duration: TRIAL_RT,
      timeout_message: TIMEOUT_MSG,
      show_stim_with_feedback: false,
      correct_feedback_duration: STAR_ITI,
      incorrect_feedback_duration: T_ITI,
      timeout_message_duration: T_timeout_message_duration,
      stage: 3,
      data: {
        block: b,
        trial: i,
        arm: arm_seq[i],
        stage: 3,
        reversed_arm: maze_info.reversed_arms.includes(arm_seq[i]),
      }
    };

    // this loop structure is used for the 2nd and 3rd stages as well
    let F_loop = { // loop the 1st stage trial 10 times
        timeline: [F_trial],
        loop_function: data => {

            if (data.values()[0].key_press == null) {
              no_response++; // track no responses
            }
            if (no_response >= no_response_threshold) {
              kill_check = 1; // we're not actually doing killchecks right now (more for MTurk)
            }
            console.log(no_response);

            counter1++; // increment # times we've shown 1st  stage trial
            data.values()[0].num_presses_this_trial = counter1; // track # of keypresses for this trial
            if (counter1 == stage_chances) { // Jimmy hardcoded the 10 trial cap
              if (data.values()[0].correct) {
                F_succeed = 1; // important for node that moves on to 2nd stage later
              }
              return false;
            } else { // if we're not the 10th attempt in the loop
              if (data.values()[0].correct) {
                F_succeed = 1;
                return false;
              } else {
                return true;
              }
            }
        },
    };

    // If run out of the 10 chances in F, display this message
    let F_nomorechances = {
      type: 'html-keyboard-response',
      stimulus: TRY_ALL_KEYS_MSG,
      choices: jsPsych.NO_KEYS,
      trial_duration: F_nomorechance
    };

    // If we run out of 10 chances in a stage, we move onto the next trial (starting on 1st stage again)
    let F_if_node_nomorechances = {
      timeline: [F_nomorechances],
      conditional_function: function() {
        if (F_succeed == 0) {
          return true;
        } else {
          return false;
        }
      }
    };

    var S_loop = {
        timeline: [S_trial],
        loop_function: data => {
          if (data.values()[0].key_press == null) {
            no_response++;
          }
          if (no_response >= no_response_threshold) {
            kill_check = 1;
          }
          console.log(no_response);

          counter2++;
          data.values()[0].num_presses_this_trial = counter1 + counter2;
          if (counter2 == stage_chances) {
            if ((data.values()[0].correct)) {
              S_succeed = 1;
            }
            return false;
          } else {
            if ((data.values()[0].correct)) {
              S_succeed = 1;
              return false;
            } else {
              return true;
            }
          }
        }
    };

    let F_to_S = {
      type: "html-keyboard-response",
      stimulus: "",
      choices: jsPsych.NO_KEYS,
      trial_duration: FtoS
    }

    // If run out of the 10 chances in F, do not advance to S, go to the next trial
    let if_node_FtoS = {
        timeline: [F_to_S, S_loop],
        conditional_function: function(){
          // get the data from the previous trial,
          // and check which key was pressed
          if (F_succeed == 0){
              return false;
          } else {
              return true;
          }
        }
    };

    // If run out of the 10 chances in S, display this message
    let S_nomorechances = {
      type: 'html-keyboard-response',
      stimulus: TRY_ALL_KEYS_MSG,
      choices: jsPsych.NO_KEYS,
      trial_duration: S_nomorechance
    };

    let S_if_node_nomorechances = {
      timeline: [S_nomorechances],
      conditional_function: function() {
        if (S_succeed == 0) {
          return true;
        } else {
          return false;
        }
      }
    };

    let T_loop = {
        timeline: [T_trial],
        loop_function: data => {

          if (data.values()[0].key_press == null) {
            no_response++;
          }
          if (no_response >= no_response_threshold) {
            kill_check = 1;
          }

          counter3++;
          data.values()[0].num_presses_this_trial = counter1 + counter2 + counter3;
          if (counter3 == stage_chances) {
            if (data.values()[0].correct) {
              T_succeed = 1;
            }
            return false;
          } else {
            if (data.values()[0].correct) {
              T_succeed = 1;
              return false;
            } else {
              return true;
            }
          }
        }
    };

    // If run out of the 10 chances in T, display this message
    let T_nomorechances = {
      type: 'html-keyboard-response',
      stimulus: TRY_ALL_KEYS_MSG,
      choices: jsPsych.NO_KEYS,
      trial_duration: T_nomorechance
    };

    let T_if_node_nomorechances = {
      timeline: [T_nomorechances],
      conditional_function: function() {
        if (T_succeed == 0) {
          return true;
        } else {
          return false;
        }
      }
    };

    let S_to_T = {
      type: "html-keyboard-response",
      stimulus: "",
      choices: jsPsych.NO_KEYS,
      trial_duration: StoT
    }

    // If run out of the 10 chances in S, do not advance to T, go to the next trial
    let if_node_StoT = {
        timeline: [S_to_T, T_loop],
        conditional_function: function(){
          // get the data from the previous trial,
          // and check which key was pressed
          if (S_succeed == 0){
              return false;
          } else {
              return true;
          }
        }
    };

    // ITI between trials
    let ITI = {
      type: 'html-keyboard-response',
      stimulus: '<p>+</p>',
      choices: jsPsych.NO_KEYS,
      trial_duration: trial_ITI
    };

    block_timeline.push(F_loop); // loop F stage
    block_timeline.push(F_if_node_nomorechances); // check if out of F chances
    block_timeline.push(if_node_FtoS); // transition to S stage and loop
    block_timeline.push(S_if_node_nomorechances); // check if out of S chances
    block_timeline.push(if_node_StoT); // transition to T stage and loop
    block_timeline.push(T_if_node_nomorechances); // chekc if out of T chances
    block_timeline.push(ITI);

  }

  return block_timeline;

}
