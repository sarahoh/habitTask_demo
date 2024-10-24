/*
like the base create_block function but contains additional conditional node to check if TTC
has been met and can move on out of the phase.
*/
let create_block_TTC = function(maze_info, min_trials, block_TTC, start_msg=true) {

  console.log(min_trials);
  console.log(maze_info);

  let arm_seq = gen_arm_sequence(maze_info.num_pres_per_arm);
  console.log(arm_seq);

  let hier_seq = gen_hier_sequence(arm_seq.length, maze_info.hierarchy);
  console.log(hier_seq);

  let block_TTC_grace = block_TTC + 1;
  let armTTC =
      [ Array(block_TTC_grace).fill(0),
        Array(block_TTC_grace).fill(0),
        Array(block_TTC_grace).fill(0),
        Array(block_TTC_grace).fill(0),
        Array(block_TTC_grace).fill(0),
        Array(block_TTC_grace).fill(0) ]; // track last block_TTC correct for each arm
  // helper conditional fn for checking criterion
  let check_if_TTC = data => {

    console.log('TTC ' + armTTC.map(function(e) {
      e = e.reduce((a, b) => a + b, 0);
      return e;
    }));

    // trial indices start at 0 - have we hit min number of trials
    let last_trial = jsPsych.data.get().filter({stage:1}).last(1).values()[0];
    let num_trials_done = last_trial.trial;
    let done_min_trials = num_trials_done >= min_trials - 1;

    // if all arm TTC > cutoff AND min number of trials have been completed
    if (maze_info.TTC &
        armTTC[0].reduce((a, b) => a + b, 0) >= block_TTC &
        armTTC[1].reduce((a, b) => a + b, 0) >= block_TTC &
        armTTC[2].reduce((a, b) => a + b, 0) >= block_TTC &
        armTTC[3].reduce((a, b) => a + b, 0) >= block_TTC &
        armTTC[4].reduce((a, b) => a + b, 0) >= block_TTC &
        armTTC[5].reduce((a, b) => a + b, 0) >= block_TTC &
        done_min_trials) {
      console.log('quit timeline');
      jsPsych.endCurrentTimeline();
      // return false;
    } else {
      console.log('keep looping timeline');
      // return true;
    }
  }

  let block_timeline = [];

  for (i = 0; i < maze_info.n_trials; i++) {

    // carryover from Jimmy's OT task, helps track whether to move on from stages
    let counter1 = 0;
    let F_succeed = 0;

    let counter2 = 0;
    let S_succeed = 0;

    let counter3 = 0;
    let T_succeed = 0;

    let no_response = 0;

    // increment block
    if (maze_info.breaks & i % maze_info.num_trials_break == 0) {
      maze_info.block = maze_info.block + 1;
      maze_info.blockIdx = maze_info.blockIdx + 1;
    }

    let block_num_start = {
      type: 'html-keyboard-response',
      stimulus: `<p>Block ${maze_info.block} is about to start!<br><br>Get ready to respond using [S,D,F,J,K,L] keys.</p>`,
      choices: jsPsych.NO_KEYS,
      trial_duration: 3000,
    }

    let block_start = {
      type: 'html-keyboard-response',
      stimulus: `<p>Block is about to start!<br><br>Get ready to respond using [S,D,F,J,K,L] keys.</p>`,
      choices: jsPsych.NO_KEYS,
      trial_duration: 3000,
    }

    let if_node_blockstart = {
      timeline: [block_start],
      conditional_function: function() {
        // how many trials so far this block? if none, show block start event
        if (jsPsych.data.get().filter({block: maze_info.block, stage:3}).count() == 0) {
          return true;
        } else {
          return false;
        }
      }
    };

    let create_F_stim = trial => {
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true, stage_trial: 1, stage:3}).count();
      let img_fname = `static/img/${avatar_order}/h${hier_seq[trial.trial]}s1${maze_info.name}.png`;
      trial.correct_text = trial.stimulus;
      trial.stimulus = `<p id='points'>Points:&emsp;<b>${pts}</b></p><img id='maze' src='${img_fname}'><p class='bottom'>Use the keys to enter the maze</p>`;
      trial.incorrect_text = `<p id='points' class='faded'>Points:&emsp;<b>${pts}</b></p><img id='maze' class='faded' src='${img_fname}'/>`;
    };

    let F_trial = { // trial object for first stage (entering the maze)
      type: "categorize-html",
      stimulus: `<img id='maze' src='static/img/h${hier_seq[i]}.png'/>`,
      on_start: create_F_stim,
      condition: maze_info.condition,
      block: maze_info.block,
      blockIdx: maze_info.blockIdx,
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
        maze: maze_info.name,
        block: maze_info.block,
        blockIdx: maze_info.blockIdx,
        trial: i,
        arm: arm_seq[i],
        label: 'TTC_trial',
        stage: 1,
        key_answer: maze_info.first_stage_key,
        reversed_arm: maze_info.reversed_arms.includes(arm_seq[i]-1),
        hierarchy: hier_seq[i]
      }
    };

    let create_S_stim = trial => {
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true, stage_trial: 1, stage:3}).count();
      let img_fname = `static/img/h${hier_seq[trial.trial]}s2${hier_seq[trial.trial]<2 ? maze_info.name : ''}.png`;
      trial.correct_text = trial.stimulus;
      trial.stimulus = `<p id='points'>Points:&emsp;<b>${pts}</b></p><img id='maze' src='${img_fname}'/><p class='bottom'>Use the keys to enter an arm</p>`;
      trial.incorrect_text = `<p id='points' class='faded'>Points:&emsp;<b>${pts}</b></p><img id='maze' class='faded' src='${img_fname}'/>`;
    };

    let S_trial = {
      type: "categorize-html",
      stimulus: `<img id='maze' src='static/img/h${hier_seq[i]}.png'/>`,
      on_start: create_S_stim,
      condition: maze_info.condition,
      block: maze_info.block,
      blockIdx: maze_info.blockIdx,
      trial: i,
      choices: maze_info.keys,
      trial_duration: TRIAL_RT,
      timeout_message: TIMEOUT_MSG,
      timeout_message_duration: S_timeout_message_duration,
      key_answer: maze_info.second_stage_key,
      show_stim_with_feedback: false,
      correct_feedback_duration: 0,
      incorrect_feedback_duration: S_ITI,
      animate_incorrect_feedback: vibrateMaze,
      incorrect_anim_duration: vibrate_ITI,
      correct_text: "",
      incorrect_text: "",
      stage: 2,
      data: {
        maze: maze_info.name,
        block: maze_info.block,
        blockIdx: maze_info.blockIdx,
        trial: i,
        arm: arm_seq[i],
        label: 'TTC_trial',
        stage: 2,
        key_answer: maze_info.second_stage_key,
        reversed_arm: maze_info.reversed_arms.includes(arm_seq[i]-1),
        hierarchy:hier_seq[i]
      }
    };

    let create_T_stim = trial => {
      let num_blobs = jsPsych.data.get().filter({block: trial.block, trial: trial.trial, correct: false, stage:3}).count();
      let t = 10;
      let r = 18; // 28;
      let w = 7;
      let blobs = ''; let faded_blobs = `<img class='faded blob' src='static/img/blob.png'>`;
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true, stage_trial: 1, stage:3}).count();
      // let correct_pts = pts + 1;
      let outcome = `<p id='outcome' style='color:darkgreen'>+1</p>`;
      if (num_blobs > 0) {
        outcome = `<p id='outcome'></p>`;// `<p id='outcome' style='color:red'>+0</p>`;
        // correct_pts = pts;
        blobs = `<img class='blob' src='static/img/blob.png'>`;
      }
      for (i=1; i<num_blobs+1; i++) {
        t += w;
        if (i%8==0) {
          r -= w;
          t = 10;
        }
        if (i<num_blobs) {
          blobs += `<img class='blob' style='top:${t}%;right:${r}%' src='static/img/blob.png'>`;
        }
        faded_blobs += `<img class='faded blob' style='top:${t}%;right:${r}%' src='static/img/blob.png'>`;
      }
      let trial_arm = arm_seq[trial.trial];
      let img_fname = `static/img/h${hier_seq[trial.trial]}s${trial_arm}${hier_seq[trial.trial]<1 ? maze_info.name : ''}.png`;
      trial.stimulus = `<p id='points'>Points:&emsp;<b>${pts}</b></p>` + blobs + `<img id='maze' src='${img_fname}'/><p class='bottom'>Use the keys to collect the reward in this arm</p>`;
      trial.correct_text = `<p id='points'>Points:&emsp;<b>${pts}</b>`+outcome+`</p>` + blobs + `<img class='star' src='static/img/star.png'><img id='maze' src='${img_fname}'/>`;
      trial.incorrect_text = `<p id='points' class='faded'>Points:&emsp;<b>${pts}</b></p>` + faded_blobs + `<img id='maze' class='faded' src='static/img/h2s${trial_arm}.png'/>`;
      trial.key_answer = maze_info.third_stage_key[trial_arm-3];
      trial.data.key_answer = maze_info.third_stage_key[trial_arm-3];
    };

    let countTrialPresses = data => {
      if (data.correct)
        data.num_presses_this_trial = jsPsych.data.get().filter({block: data.block, trial: data.trial}).count();
    }

    let T_trial = { // trial object for third (getting a point in arm)
      type: "categorize-html",
      stimulus: `<img id='maze' src='static/img/h${hier_seq[i]}.png'/>`,
      on_start: create_T_stim,
      on_finish: countTrialPresses,
      condition: maze_info.condition,
      block: maze_info.block,
      blockIdx: maze_info.blockIdx,
      trial: i,
      choices: maze_info.keys,
      timeout_message: TIMEOUT_MSG,
      timeout_message_duration: T_timeout_message_duration,
      trial_duration: TRIAL_RT,
      show_stim_with_feedback: false,
      correct_feedback_duration: STAR_ITI,
      incorrect_feedback_duration: T_ITI,
      animate_incorrect_feedback: incorrectAnim,
      animate_correct_feedback: correctAnim,
      correct_anim_duration: starAnim_ITI,
      stage: 3,
      data: {
        maze: maze_info.name,
        block: maze_info.block,
        blockIdx: maze_info.blockIdx,
        trial: i,
        arm: arm_seq[i],
        label: 'TTC_trial',
        stage: 3,
        reversed_arm: maze_info.reversed_arms.includes(arm_seq[i]-1),
        hierarchy: hier_seq[i]
      }
    };


    let F_loop = {
      timeline: [F_trial],
      loop_function: data => {

        if (data.values()[0].key_press == null) {
          no_response++;
          console.log('no resp ' + no_response);
        }
        if (no_response >= no_response_threshold) {
          kill_check = 1;
        }

        F_succeed = 0;
        counter1++;
        data.values()[0].num_presses_this_trial = counter1;
        data.values()[0].stage_trial = counter1;
        if (counter1 == 1) {
          if (data.values()[0].correct) {
            armTTC[0].push(1) // push a 1 onto the end of the TTC tracker array for the current arm if first attempt was correct
          } else {
            armTTC[0].push(0) // otherwise, push a 0 onto the end of the TTC tracker array for the current arm
          }
          armTTC[0].shift() // shift out the first element of the TTC tracker array for the current arm
        }

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
        console.log(no_response);
        S_succeed = 0;
        counter2++;
        data.values()[0].num_presses_this_trial = counter1 + counter2;
        data.values()[0].stage_trial = counter2;
        if (counter2 == 1) {
          if (data.values()[0].correct) {
            armTTC[1].push(1) // push a 1 onto the end of the TTC tracker array for the current arm if first attempt was correct
          } else {
            armTTC[1].push(0) // otherwise, push a 0 onto the end of the TTC tracker array for the current arm
          }
          armTTC[1].shift() // shift out the first element of the TTC tracker array for the current arm
        }

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
      stimulus: `<img id='maze' src='static/img/h${hier_seq[i]}.png'/>`,
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
        T_succeed = 0;
        counter3++;
        data.values()[0].num_presses_this_trial = counter1 + counter2 + counter3;
        data.values()[0].stage_trial = counter3;
        if (counter3 == 1) {
          if (data.values()[0].correct) {
            armTTC[data.values()[0].arm - 1].push(1) // push a 1 onto the end of the TTC tracker array for the current arm if first attempt was correct
          } else {
            armTTC[data.values()[0].arm - 1].push(0) // otherwise, push a 0 onto the end of the TTC tracker array for the current arm
          }
          armTTC[data.values()[0].arm - 1].shift() // shift out the first element of the TTC tracker array for the current arm
        }

        if (counter3 == stage_chances) {
          if (data.values()[0].correct) {
            T_succeed = 1;
          }
          return false;
        } else {
          if (data.values()[0].correct) {
            // update arm streak
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
        if (T_succeed == 0) { // no more tries
          return true; // show no more chances message if
        } else {
          return false;
        }
      }
    };

    let S_to_T = {
      type: "html-keyboard-response",
      stimulus: `<img id='maze' src='static/img/h${hier_seq[i]}.png'/>`,
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
      trial_duration: trial_ITI,
      on_finish: check_if_TTC
    };

    let show_break = {
      type: "html-keyboard-response",
      trial_duration: 120000,
      choices: ['space'],
      on_start: trial => {
        let last_trial = jsPsych.data.get().filter({label:'TTC_trial'}).last(1).values()[0];
        // pts from this block: get count of corrects filtered by block, stage 3
        let pts = jsPsych.data.get().filter({block: last_trial.block, correct: true, stage_trial: 1, stage:3}).count();
        subj_blk_scores.push(pts);
        // summarize scores read by php script
        let blk_scores = [];
        scores.forEach(function(x) {blk_scores = blk_scores.concat(Number(x[last_trial.blockIdx]))})
        blk_scores = blk_scores.filter(Boolean); // filter out NaNs
        let pct_comparison = Math.round(returnLT(blk_scores, pts).length * 100 / blk_scores.length);
        if (pts == 0) {
          trial.stimulus = `You got ${pts} stars this block. Please participate fully in the next block.<br><br>`;
        } else {
          trial.stimulus = `Well done! You got ${pts} stars.<br>This means you did better than ${pct_comparison}% of players in this part of the game.<br><br>`;
        }
        trial.stimulus = trial.stimulus + `Your total score so far is ${subj_blk_scores.reduce((accum, currentVal) => accum + currentVal, 0)}.<br><br>
            Take a short break (please do not leave this tab/window), and see if you can do better next block!<br><br>
            Remember: the experiment is designed so that you will finish sooner if you perform better at the task.<br><br>
            Press [space] when you're ready to start again - otherwise, the next block will begin in 2 minutes.`;
        let to_save = jsPsych.data.get().filter({block: last_trial.block});
        let f_name = file_name + `_` + maze_info.condition + `_block_` + last_trial.block;
        // save_data_json(f_name, to_save);
      },
      data: {
        block: maze_info.block,
        blockIdx: maze_info.blockIdx,
        trial: 'break',
      }
    };


    let pre_ITI = {
      type: 'html-keyboard-response',
      stimulus: '<p>+</p>',
      choices: jsPsych.NO_KEYS,
      trial_duration: 0,
      on_start: function(trial) {
        F_succeed = 0;
        S_succeed = 0;
        T_succeed = 0;
      }
    };

    if (maze_info.breaks & i % maze_info.num_trials_break == 0) {
      block_timeline.push(block_num_start); // loop F stage
    } else if (i == 0 & start_msg) {
      block_timeline.push(block_start);
    }
    block_timeline.push(pre_ITI);
    block_timeline.push(F_loop); // loop F stage
    block_timeline.push(F_if_node_nomorechances); // check if out of F chances
    block_timeline.push(if_node_FtoS); // transition to S stage and loop
    block_timeline.push(S_if_node_nomorechances); // check if out of S chances
    block_timeline.push(if_node_StoT); // transition to T stage and loop
    block_timeline.push(T_if_node_nomorechances); // check if out of T chance
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
