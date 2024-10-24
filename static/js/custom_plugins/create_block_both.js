// maybe make a version of this with added instructions for cameron and alex

let create_block_both = function(maze_info, is_practice) {

  /* need to counterbalance arm sequences so that they are split 50/50 between the two mazes.
  would need to random the sequence of 'a' and 'c' throughout the 100 trials too.
  */
  console.log(maze_info);
  let arm_name_hier_seq = [];
  if (is_practice) {
    arm_name_hier_seq = gen_arm_name_hier_sequence_pract(maze_info.num_pres_per_arm); // full counterbalance
  } else {
    arm_name_hier_seq = gen_arm_name_hier_sequence(maze_info.num_pres_per_arm_both_con, maze_info.ratio_num_pres_rev_con)
  }
  let mazes = ['a','c'];

  console.log(arm_name_hier_seq);

  let block_timeline = [];

  for (i = 0; i < maze_info.n_trials; i++) {

    // carryover from Jimmy's OT task, helps track whether to move on from stages
    let counter1 = 0;
    let F_succeed = 0;

    let counter2 = 0;
    let S_succeed = 0;

    let counter3 = 0;
    let T_succeed = 1; // assume succeed by default, because we don't care if they make the correct press anymore. we only toggle this to 0 if they don't make enough presses
    let only_one_press = 0;

    let no_response = 0;

    // increment block
    if (maze_info.breaks & i % maze_info.num_trials_break == 0) {
      maze_info.block = maze_info.block + 0.1;
    }

    let block_start = {
      type: 'html-keyboard-response',
      stimulus: `<p>Second half of final stage is about to start!<br><br>Get ready to respond using [S,D,F,J,K,L] keys.</p>`,
      choices: jsPsych.NO_KEYS,
      trial_duration: 3000,
    }

    let create_F_stim = trial => {
      let a = arm_name_hier_seq[0][trial.trial];
      let m = arm_name_hier_seq[1][trial.trial];
      if (m>0)
        trial.data.reversed_arm = maze_info.reversed_arms.includes(a-1);
      let maze = mazes[m];
      trial.maze = maze;
      trial.data.maze = maze;
      let h = arm_name_hier_seq[2][trial.trial];
      let img_fname = `static/img/${avatar_order}/h${h}s1${maze}.png`;
      trial.correct_text = trial.stimulus;
      trial.stimulus = `<img id='maze' src='${img_fname}'/><p class='bottom'>Use the keys to enter the maze</p>`;
      trial.incorrect_text = `<img id='maze' class='faded' src='${img_fname}'/>`;
      trial.data.key_answer = maze_info.first_stage_key;
    };

    let F_trial = {
      type: "categorize-html",
      stimulus: `<img id='maze' src='static/img/h${arm_name_hier_seq[2][i]}.png'/>`,
      on_start: create_F_stim,
      condition: maze_info.condition,
      trial: i,
      choices: maze_info.keys,
      timeout_message: TIMEOUT_MSG,
      timeout_message_duration: F_timeout_message_duration,
      key_answer: maze_info.first_stage_key,
      trial_duration: TRIAL_RT,
      show_stim_with_feedback: false,
      correct_feedback_duration: 0,
      incorrect_feedback_duration: F_ITI,
      animate_incorrect_feedback: vibrateMaze,
      incorrect_anim_duration: vibrate_ITI,
      correct_text: "",
      incorrect_text: "",
      stage: 1,
      data: {
        condition: maze_info.condition,
        block: maze_info.block,
        blockIdx: maze_info.blockIdx,
        trial: i,
        arm: arm_name_hier_seq[0][i],
        label: 'both_trial',
        stage: 1,
        hierarchy: arm_name_hier_seq[2][i],
      }
    };

    let create_S_stim = trial => {
      let a = arm_name_hier_seq[0][trial.trial];
      let m = arm_name_hier_seq[1][trial.trial];
      if (m>0)
        trial.data.reversed_arm = maze_info.reversed_arms.includes(a-1);
      let maze = mazes[m];
      trial.maze = maze;
      trial.data.maze = maze;
      let h = arm_name_hier_seq[2][trial.trial];
      if (h>1) maze = '';
      let img_fname = `static/img/h${h}s2${maze}.png`;
      trial.correct_text = trial.stimulus;
      trial.stimulus = `<img id='maze' src='${img_fname}'/><p class='bottom'>Use the keys to enter an arm</p>`;
      trial.incorrect_text = `<img id='maze' class='faded' src='${img_fname}'/>`;
      trial.data.key_answer = maze_info.second_stage_key;
    };

    let S_trial = {
      type: "categorize-html",
      stimulus: `<img id='maze' src='static/img/h${arm_name_hier_seq[2][i]}.png'/>`,
      on_start: create_S_stim,
      condition: maze_info.condition,
      trial: i,
      choices: maze_info.keys,
      timeout_message: TIMEOUT_MSG,
      timeout_message_duration: S_timeout_message_duration,
      key_answer: maze_info.second_stage_key,
      trial_duration: TRIAL_RT,
      show_stim_with_feedback: false,
      correct_feedback_duration: 0,
      incorrect_feedback_duration: S_ITI,
      animate_incorrect_feedback: vibrateMaze,
      incorrect_anim_duration: vibrate_ITI,
      correct_text: "",
      incorrect_text: "",
      stage: 2,
      data: {
        condition: maze_info.condition,
        block: maze_info.block,
        blockIdx: maze_info.blockIdx,
        trial: i,
        arm: arm_name_hier_seq[0][i],
        label: 'both_trial',
        stage: 2,
        hierarchy: arm_name_hier_seq[2][i],
      }
    };

    let create_T_stim = trial => {
      let a = arm_name_hier_seq[0][trial.trial];
      let m = arm_name_hier_seq[1][trial.trial];
      if (m>0)
        trial.data.reversed_arm = maze_info.reversed_arms.includes(a-1);
      let maze = mazes[m];
      trial.maze = maze;
      trial.data.maze = maze;
      let h = arm_name_hier_seq[2][trial.trial];
      if (h>0) maze = '';
      let img_fname = `static/img/h${h}s${a}${maze}.png`;
      trial.correct_text = trial.stimulus;
      trial.stimulus = `<img id='maze' src='${img_fname}'/>
      <p class='bottom'>Use the keys to collect as many rewards as possible in this arm</p>`;
      if (only_one_press==1)
        trial.stimulus = `<img id='maze' src='${img_fname}'/><p class='bottom'>Use the keys to collect as many rewards as possible in this arm. Remember to press more than once!</p>`;
      trial.key_answer = maze_info.third_stage_key[m][a-3];
      trial.data.key_answer = maze_info.third_stage_key[m][a-3];
    };

    let count_correct_responses = data => { // on_finish function for REAL third stage trials (not showing FB)
      // turn the key_press and rt values into arrays to save into the key_press and rt properties
      data.key_press = JSON.parse(data.key_press);
      data.rt = JSON.parse(data.rt);
      // count how many correct key presses were made
      data.num_correct_responses = data.key_press.filter(x => x == data.key_answer).length;
      data.num_responses = data.key_press.length;
      data.num_incorrect_responses = data.num_responses - data.num_correct_responses;
      data.num_pts = Math.max(data.num_correct_responses-data.num_incorrect_responses, 0);
    }

    let T_trial = { // trial object for third (getting a point in arm)
      type: "html-keyboard-response-persist",
      stimulus: `<img id='maze' src='static/img/h${arm_name_hier_seq[2][i]}.png'/>`,
      on_start: create_T_stim,
      on_finish: count_correct_responses,
      response_ends_trial: false,
      condition: maze_info.condition,
      trial: i,
      choices: maze_info.keys,
      timeout_message: TIMEOUT_MSG,
      timeout_message_duration: T_timeout_message_duration,
      trial_duration: COLLECT_STAR_RT,
      show_stim_with_feedback: false,
      stage: 3,
      data: {
        condition: maze_info.condition,
        block: maze_info.block,
        blockIdx: maze_info.blockIdx,
        trial: i,
        arm: arm_name_hier_seq[0][i],
        label: 'both_trial',
        stage: 3,
        hierarchy: arm_name_hier_seq[2][i],
      }
    };

    let create_FB = trial => { // ONLY for practice trials (dont show num stars obtained in actual trials)
      let data = jsPsych.data.get().last(1).values()[0];
      let num_stars = data.num_correct_responses;
      let num_blobs = data.num_incorrect_responses;
      let a = data.arm;
      let h = data.hierarchy;
      let maze = data.maze;
      if (h>0) maze = '';
      // create the HTML by aligning the stars in columns of 8
      let t = 10;
      let r = 18; // 28;
      let w = 7;
      let stars = '';
      if (num_stars > 0) {
        stars = `<img class='star' img src='static/img/star.png'>`;
      }
      for (i=1;i<num_stars;i++) {
        t += w;
        if (i%8==0) {
          r -= w;
          t = 10;
        }
        stars += `<img class='star' img style='top:${t}%;right:${r}%'img src='static/img/star.png'>`;
      }
      t = 10;
      r = 18;
      w = 7;
      let blobs = '';
      if (num_blobs > 0) {
        blobs = `<img class='blob' img src='static/img/blob.png'>`;
      }
      for (i=1;i<num_blobs;i++) {
        t += w;
        if (i%8==0) {
          r -= w;
          t = 10;
        }
        blobs += `<img class='blob' img style='top:${t}%;right:${r}%'img src='static/img/blob.png'>`;
      }
      trial.stimulus = `<p class='points'></p>${stars}${blobs}<img id='maze' src='static/img/h${h}s${a}${maze}.png'/>
      <p class='bottom'>You got ${Math.max(num_stars-num_blobs, 0)} stars!</p>`;
      return trial;
    }

    let T_feedback = {
      type: "html-keyboard-response",
      on_start: create_FB,
      on_load: animTestPractFB,
      trial_duration: T_star_message_duration_testPract, // show all stars for 1s (was 1000 before adding accuracy)
      choices: jsPsych.NO_KEYS,
      stage: 3,
    };


    let F_loop = {
        timeline: [F_trial],
        loop_function: data => {

            if (data.values()[0].key_press == null) {
              no_response++;
            }
            if (no_response >= no_response_threshold) {
              kill_check = 1;
            }

            counter1++;
            data.values()[0].num_presses_this_trial = counter1;
            if (counter1 == stage_chances) {
              if (data.values()[0].correct) {
                F_succeed = 1;
              }
              return false;
            } else {
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
      stimulus: `<img id='maze' src='static/img/h${arm_name_hier_seq[2][i]}.png'/>`,
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

    let S_to_T = {
      type: "html-keyboard-response",
      stimulus: `<img id='maze' src='static/img/h${arm_name_hier_seq[2][i]}.png'/>`,
      choices: jsPsych.NO_KEYS,
      trial_duration: StoT
    }

    // If run out of the 10 chances in S, do not advance to T, go to the next trial
    let if_node_StoT = {
        timeline: [S_to_T, T_trial],
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

    // implement a T-loop for practice trials in the instructions; repeat the T stage if only one key press is made
    // we don't use this for the actual trials (dont show FB)
    let T_loop = {
      timeline: [T_trial,T_feedback],
      loop_function: data => {

        if (data.values()[0].key_press == null) {
          no_response++;
        }
        if (no_response >= no_response_threshold) {
          kill_check = 1;
        }

        counter3++;
        data.values()[0].num_presses_this_trial = counter1 + counter2 + counter3;
        // pass the practice (T_succeed = 1 iff data.values[0].key_press.length > 1)
        let presses = data.values()[0].key_press;


        if (presses.length > 1) { // if they pressed more than one key
          T_succeed = 1;
          return false;
          only_one_press = 0;
        } else { // if they only made one key press
          if (counter3 == stage_chances) // if they're on the 10 try, end it
            return false;
          else { // if they still have tries left
            console.log('only pressed one key');
            only_one_press = 1;
            T_succeed = 0;
            return true; // keep looping
          }

        }
      }
    };

    // If run out of the 10 chances in S, do not advance to T, go to the next trial
    let if_node_StoT_practice = {
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

    // If run out of the 10 chances in T, display this message
    let T_nomorechances = {
      type: 'html-keyboard-response',
      stimulus: TRY_ALL_KEYS_MSG,
      choices: jsPsych.NO_KEYS,
      trial_duration: TRY_ALL_KEYS_ITI
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


    // end of stuff for practice trials (loop tries if they dont press multiple times)

    // ITI between trials
    let ITI = {
      type: 'html-keyboard-response',
      stimulus: '<p>+</p>', //
      choices: jsPsych.NO_KEYS,
      trial_duration: trial_ITI, //
    };

    let show_break = {
      type: "html-keyboard-response",
      trial_duration: 120000,
      choices: ['space'],
      stimulus: `You are done with the first half of the final phase - almost done! 
            <br><br>Take a short break (please do not leave this tab/window).
            <br><br>Press [space] when you're ready to start again - otherwise the second half of the final phase will begin in 2 minutes.`,
      data: {
        block: maze_info.block,
        blockIdx: maze_info.blockIdx,
        trial: 'break',
      }
    }

    let pre_ITI = {
      type: 'html-keyboard-response',
      stimulus: '<p>+</p>',
      choices: jsPsych.NO_KEYS,
      trial_duration: 0,
      on_start: function(trial) {
        F_succeed = 0;
        S_succeed = 0;
        T_succeed = 1;
      }
    };

    if (maze_info.breaks & i % maze_info.num_trials_break == 0 & i > 0) {
      block_timeline.push(block_start); // loop F stage
    }
    block_timeline.push(pre_ITI);
    block_timeline.push(F_loop); // loop F stage
    block_timeline.push(F_if_node_nomorechances); // check if out of F chances
    block_timeline.push(if_node_FtoS); // transition to S stage and loop
    block_timeline.push(S_if_node_nomorechances); // check if out of S chances

    if (is_practice) { // use the practice if node which runs T loop instead of single T trial
      block_timeline.push(if_node_StoT_practice); // transition to T stage and loop
      block_timeline.push(T_if_node_nomorechances); // chekc if out of T chances
    }
    else { // do we want to give people chances if they make no key presses in the real game?
      block_timeline.push(if_node_StoT); // transition to T stage and loop
    }
    block_timeline.push(ITI);

    if (maze_info.breaks) { // check for break
      if ((i + 1) < maze_info.n_trials & // show break if more trials remaining
          (i + 1) % maze_info.num_trials_break == 0) { // every maze_info.num_trials_break trial
        block_timeline.push(show_break); // time for a break
      }
    }

  }

  return block_timeline;

}
