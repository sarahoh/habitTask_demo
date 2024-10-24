/* set up instructions used throughout the task, as well as the function that makes
practice block trials. */

// fixed one-line messages
let REMIND_KEY_PRACTICE_MSG = "<p>Try again! Use keys [W,E,R,U,I,O] to choose an action.</p>";
let REMIND_KEY_MSG = "<p>Use keys [S,D,F,J,K,L] to choose an action.</br>Try again!</p>";
let TRY_ALL_KEYS_MSG = "<p>Make sure you try all keys!</p>";
let TIMEOUT_MSG = "<p>Choose an action fast enough.</br>Try again!</p>";
let CONT_MSG = "<p class='continue'>[Press SPACE to continue]</p>";

// alex instructions
let alex_inst_1 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1a.png'/>
              <p class='bottom'>This is Alex.
              <br>Alex's goal is to get stars from the maze.
              <br>Each star Alex collects is worth <b>1 point</b>.</p>` + CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
};


let alex_inst_2 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1a.png'/>
              <p class='bottom'>To get stars, Alex needs to first figure out how to jump to the center of the maze.</p>` + CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
};


let alex_inst_3 = {
  type: "html-keyboard-response",
  stimulus: `<div class='center'><p>To recap:<br>When in a maze arm, pressing a correct key will collect a star. Pressing a wrong key will collect an anti-star, each of which can cancel out one star. 
    <br>Each time you collect a star that doesn't get cancelled out by an anti-star, you win <b>1 point</b>.
    <br><br>Your goal is to win as many points as possible, as quickly as possible, by helping Alex collect stars while avoiding anti-stars.
    <br>We'll keep track of your tally!</p></div>` + CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let alex_inst_3_5 = {
  type: "html-keyboard-response",
  stimulus: function() {
    let instr_txt = `<div class='center'><p>Throughout the game, we will occasionally let you know how many points you earned and how you performed relative to other players.`;
    if (version == 'prolific') {
      instr_txt = instr_txt + `<br><br>We will tally up the points you win in each phase of the game.
        <br><br><b>Your total score at the end will be used to determine a monetary bonus of up to $3.</b></p></div>` + CONT_MSG ;
    } else {
      instr_txt = instr_txt + `<br><br>At the end of the game, we will tally up your points from each phase of the game and let you know how your final score compares to other players' final scores!</b></p></div>` + CONT_MSG ;
    }
    return instr_txt
  },
  choices: ['space'],
  trial_duration: MAX_RT
}

let alex_inst_4 = {
  type: "html-keyboard-response",
  stimulus: `<div class='center'><p>During the real game, you will use a new set of keys: [S,D,F,J,K,L].
  <br><br>The progress bar above will show how far you've made it through the entire experiment.
  <br><br>Keep in mind that the experiment is designed so that you will finish sooner if you perform better at the task!</p></div>`+CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

// If they are confused, give them a choice to go through timeline_practice again.
// gaia mentioned swapping keys for this might be good
let pre_if_alex_trial = {
  type: 'html-keyboard-response',
  stimulus: `<div class='center'><p>If you want, you can go through the practice one more time by pressing P.
      <br><br>Otherwise, you can start the real game by pressing Q.</p></div>`,
  choices: ['p','q'],
};
let pre_alex_start = {
  type: 'html-keyboard-response',
  stimulus: `<div class='center'><p>When you are ready, start the real game by pressing P.</p></div>`,
  choices: ['p'],
};

// cameron (reversal) instructions
let cam_inst_1 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1c.png'/>
              <p class='bottom'>This is Cameron. Cameron's goal is also to get stars from the maze.<br>
              You can also control Cameron by using [S,D,F,J,K,L] keys on your keyboard.</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
};

let cam_inst_2 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1c.png'/>
              <p class='bottom'>Cameron also needs to first jump in the center of the maze, then to one of the arms,
              then collect a star. You will also win points each time Cameron collects a star, 
              as long as it doesn't get cancelled by an anti-star.</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
};

let cam_inst_3 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1c.png'/>
              <p class='bottom'>However, the way you control Cameron might be slightly different from the
              way you control Alex. You'll have to figure it out!.</p>`+ CONT_MSG,
              // <br><br>Once you reach a certain level of performance, you'll move on to the next stage of the game.</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
};

let pre_if_cam_trial = {
  type: 'html-keyboard-response',
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1c.png'/>
              <p class='bottom'>Ready to try? Press P to see the instructions one more time,
              or Q to start playing with Cameron!</p>`,
  choices: ['p','q'],
  trial_duration: MAX_RT
}

let practice_if_cam_node = {
    timeline: [cam_inst_1, cam_inst_2, cam_inst_3],
    conditional_function: function(){
        // get the data from the previous trial,
        // and check which key was pressed
        var data = jsPsych.data.get().last(1).values()[0];
        if (data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('q'))
          return false;
        else
          return true;
    }
};

// last phase instructions (show both mazes)
let both_inst_1 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1ac.png'/>
              <p class='bottom'>Now, the last part of the game starts!</p>`+ CONT_MSG,
// <!--              <p class='bottom'>Now, the last part of the game starts! This time, you will collect stars for both Alex and Cameron.</p>-->`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let both_inst_2 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1ac.png'/>
              <p class='bottom'>In this stage, you might see either Alex or Cameron at every trial. Everything you learned
              before is unchanged: you can still control Alex and Cameron exactly as you did before!</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}



let both_inst_3 = {
  type: "html-keyboard-response",
  stimulus: `<div class='center'><p>Let's give you a chance to remember how to control both Alex and Cameron.
              <br>This is just practice and will not count toward your final score.
              <br><br>We'll start with Alex.</p></div>` + CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let both_inst_3_1 = {
  type: "html-keyboard-response",
  stimulus: `<div class='center'><p>Great! Now, let's try remembering how to control Cameron.</p></div>` + CONT_MSG,
            choices: ['space'],
            trial_duration: MAX_RT
}

let both_inst_3_2 = {
  type: "html-keyboard-response",
  stimulus: `<div class='center'><p>Great! Let's try Alex again.</p></div>` + CONT_MSG,
            choices: ['space'],
            trial_duration: MAX_RT
}

let both_inst_3_3 = {
  type: "html-keyboard-response",
  stimulus: `<div class='center'><p>Great! Let's try Cameron again.</p></div>` + CONT_MSG,
            choices: ['space'],
            trial_duration: MAX_RT
}

let both_inst_3_9 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1ac.png'/>
              <p class='bottom'>Great, you remember how to control Alex and Cameron!</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let both_inst_4 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1ac.png'/>
              <p class='bottom'>In this last part of the game, you have ${num_trials_both} trials to try to win as many points as possible.</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let both_inst_5 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1ac.png'/>
              <p class='bottom'>One small change: this time, when you get to an arm of the maze, you will stay in the arm
              for a short, fixed time (${COLLECT_STAR_RT/1000} seconds), instead of exiting as soon as you find a star.</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let both_inst_5_1 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1ac.png'/>
              <p class='bottom'>You can collect stars for as long as you are in the arm, and they will go towards your
              points, as long as they don't get cancelled out by anti-stars!</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let both_inst_5_2 = {
  type: "html-keyboard-response",
  stimulus: `<img id='maze' src='static/img/${avatar_order}/h2s1ac.png'/>
              <p class='bottom'>Let's start with some practice. During practice, we will show you how many stars and anti-stars you collected in each arm.</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let both_inst_6 = {
  type: "html-keyboard-response",
  stimulus: `<p class='center'>During the real game, we won't show you the stars you get.
            <br><br>At the end of the experiment, we will let you know how many points you got, and how your final score compares to that of other players!</p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let both_inst_6_4 = {
  type: "html-keyboard-response",
  stimulus: `<p class='center'>Remember: you can still control Alex and Cameron exactly as before.
            <br><br>Do your best to collect as many stars as possible when you're in the arms of the maze for Alex and Cameron!
            </p>`+ CONT_MSG,
  choices: ['space'],
  trial_duration: MAX_RT
}

let pre_if_both_trial = {
    type: 'html-keyboard-response',
    stimulus: `<p class='center'>Press Q when you're ready to start, or P to see the instructions for this one more time.</p>`,
    choices: ['p','q'],
}

// when they see instructions again, only the static instructions are looped
let practice_if_both_node = {
    timeline: [both_inst_1,both_inst_2,both_inst_4,both_inst_5,both_inst_5_1,both_inst_6,both_inst_6_4],
    conditional_function: function(){
        var data = jsPsych.data.get().last(1).values()[0];
        if (data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('q'))
          return false;
        else
          return true;
    }
};




// create practice trials for the instructions for alex

let create_instruction_block = function(maze_info, attempt=1) {

  let block_timeline = [];

  let saw_F_inst = 0; // check if they already saw intro instruction for F stage
  let saw_S_inst = 0; // check if they already saw intro instruction for S stage
  let saw_T0_inst = 0; // check if they already saw intro instruction for T stage, trial 0
  let saw_T1_inst = 0; // check if they already saw intro instruction for T sage, trial 1
  let saw_blob_inst = 0;
  let saw_star_inst = 0;

  for (i = 0; i < maze_info.n_trials; i++) {
    // carryover from Jimmy's OT task, helps track whether to move on from stages

    let counter1 = 0;
    let F_succeed = 0;

    let counter2 = 0;
    let S_succeed = 0;

    let counter3 = 0;
    let T_succeed = 0;

    let no_response = 0;

    let create_F_Stim = trial => { // on_start function for generating stimuli and instructions HTML
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true, stage_trial: 1, stage:3, attempt:attempt}).count();
      let is_retry = jsPsych.data.getLastTrialData().values()[0].stage == 1;
      trial.correct_text = trial.stimulus;
      if (trial.trial == 0) {
        if (saw_F_inst == 0) {
          trial.stimulus = `<img id='maze' src='static/img/${avatar_order}/h2s1a.png'/><p class='bottom'>You can control Alex by using the [W,E,R,U,I,O] keys on your keyboard.<br>Help Alex enter the maze!</p>`;
        }
        else {
          trial.stimulus = `<img id='maze' src='static/img/${avatar_order}/h2s1a.png'/><p class='bottom'>` + (is_retry ? "Try again!" : "Let's practice again.") + `<br>Enter the maze using [W,E,R,U,I,O].</p>`;
        }
        trial.incorrect_text = `<img id='maze' class='faded' src='static/img/${avatar_order}/h2s1a.png'/>`; // show faded maze (without points) as feedback for incorrect response
      } else {
        trial.stimulus = `<p id='points'>Points:&emsp;<b>${pts}</b></p><img id='maze' src='static/img/${avatar_order}/h2s1a.png'/><p class='bottom'>` + (is_retry ? "Try again!" : "Let's practice again.") + `<br>Help Alex enter the maze with the [W,E,R,U,I,O] keys.</p>` ;
        trial.incorrect_text = `<p id='points' class='faded'>Points:&emsp;<b>${pts}</b></p><img id='maze' class='faded' src='static/img/${avatar_order}/h2s1a.png'/>`; // show faded maze (with points) as feedback for incorrect response
      }
    };

    let F_trial = { // trial object for first stage (entering the maze)
      type: "categorize-html",
      stimulus: `<img id='maze' src='static/img/h2.png'/>`,
      on_start: create_F_Stim,
      on_finish: data => {
        saw_F_inst = 1;
      },
      condition: maze_info.condition,
      block: maze_info.block,
      trial: i,
      choices: maze_info.keys,
      timeout_message: TIMEOUT_MSG,
      timeout_message_duration: F_timeout_message_duration,
      key_answer: maze_info.first_stage_key,
      trial_duration: MAX_RT,
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
        trial: i,
        arm: maze_info.arm[i],
        stage: 1,
        key_answer: maze_info.first_stage_key,
        reversed_arm: maze_info.reversed_arms,
        hierarchy: maze_info.hierarchy,
        attempt: attempt
      },
    };

    let create_S_Stim = trial => { // set up different instructions depending on which practice trial/correct response was given
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true, stage_trial: 1, stage:3, attempt:attempt}).count();
      let is_retry = jsPsych.data.getLastTrialData().values()[0].stage == 2;
      trial.correct_text = trial.stimulus;
      if (trial.trial == 0) {
        if (saw_S_inst == 0)
          trial.stimulus = `<img id='maze' src='static/img/h2s2.png'/>
                <p class='bottom'>Great, Alex entered the maze! Now Alex needs to get to one of the arms of the maze.
                <br>Try pressing [W,E,R,U,I,O] again to help Alex move out of the center.</p>`;
        else
          trial.stimulus = `<img id='maze' src='static/img/h2s2.png'/>
                <p class='bottom'>` + (is_retry ? "Try again!" : "") + `<br>Press the [W,E,R,U,I,O] keys to enter an arm.</p>`;
        trial.incorrect_text = `<img id='maze' class='faded' src='static/img/h2s2.png'/>`; // show faded maze (without points) as feedback for incorrect response
      } else {
        trial.stimulus = `<p id='points'>Points:&emsp;<b>${pts}</b></p><img id='maze' src='static/img/h2s2.png'/><p class='bottom'>` +
            (is_retry ? "Try again!" : "") +
            `<br>Press the [W,E,R,U,I,O] keys to enter an arm.</p>`;
        trial.incorrect_text = `<p id='points' class='faded'>Points:&emsp;<b>${pts}</b></p><img id='maze' class='faded' src='static/img/h2s2.png'/>`; // show faded maze (with points) as feedback for incorrect response
      }
    };

    let S_trial = { // trial object for second stage (entering an arm)
      type: "categorize-html",
      stimulus: `<img id='maze' src='static/img/h2.png'/>`,
      on_start: create_S_Stim,
      on_finish: data => {
        saw_S_inst = 1;
      },
      condition: maze_info.condition,
      block: maze_info.block,
      trial: i,
      choices: maze_info.keys,
      trial_duration: MAX_RT,
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
        trial: i,
        arm: maze_info.arm[i],
        stage: 2,
        key_answer: maze_info.second_stage_key,
        reversed_arm: maze_info.reversed_arms,
        hierarchy: maze_info.hierarchy,
        attempt: attempt
      },
    };

    let create_T_Stim = trial => { // set up HTML for stimulus, correct/incorrect outcomes, and set the key answer of the trial
      let incorrect_trials = jsPsych.data.get().filter({block: trial.block, trial: trial.trial, correct: false, stage:3, attempt:attempt});
      let num_blob_msgs = (new Set(incorrect_trials.values().map(obj => obj.trial))).size
      let num_blobs = incorrect_trials.count();
      let t = 10;
      let r = 18; // 28;
      let w = 7;
      let blobs = ''; let faded_blobs = `<img class='faded blob' src='static/img/blob.png'>`;
      let pts = jsPsych.data.get().filter({block: trial.block, correct: true, stage_trial: 1, stage:3, attempt:attempt}).count();
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
      let trial_arm = maze_info.arm[trial.trial];
      trial.incorrect_text = `<p id='points' class='faded'>Points:&emsp;<b>${pts}</b></p>` + faded_blobs + `<img id='maze' class='faded' src='static/img/h2s${trial_arm}.png'/>`;
      if (num_blobs == 0) {
        if (trial.trial > 2) {
          trial.correct_text =`<p id='points'>Points:&emsp;<b>${pts}</b>`+outcome+`</p>` + blobs + `<img class='star' src='static/img/star.png'>` +
              `<img id='maze' src='static/img/h2s${trial_arm}.png'/>
            <p class='bottom'>Well done, you collected a star!`
          trial.correct_feedback_duration = T_star_message_duration_short;
          trial.correct_anim_duration = T_star_message_duration_short;
        } else {
          trial.correct_text =`<p id='points'>Points:&emsp;<b>${pts}</b>`+outcome+`</p>` + blobs + `<img class='star' src='static/img/star.png'>` +
              `<img id='maze' src='static/img/h2s${trial_arm}.png'/>
            <p class='bottom'>Well done, you collected a star!<br>Each star is worth one point.</p>`
          trial.correct_feedback_duration = T_star_message_duration_long;
          trial.correct_anim_duration = T_star_message_duration_short;
        }
      } else {
        saw_blob_inst = 1;
        trial.correct_feedback_duration = T_star_message_duration_unlimited;
        trial.correct_anim_duration = T_star_message_duration_short;
        trial.correct_feedback_proceed_key = 'space';
        trial.correct_text =`<p id='points'>Points:&emsp;<b>${pts}</b></p>`+outcome + blobs + `<img class='star' src='static/img/star.png'>` +
            `<img id='maze' src='static/img/h2s${trial_arm}.png'/>
            <p class='bottom'>Well done, you found the star!
            <br>Each star is worth one point. However, <b>any anti-star you collect cancels out one star.</b>
            <br>Try your best to collect stars while avoiding anti-stars.</p>` + CONT_MSG;
        if (num_blob_msgs > 2) {
          trial.correct_feedback_duration = T_star_message_duration_long;
          trial.correct_text = `<p id='points'>Points:&emsp;<b>${pts}</b></p>`+outcome + blobs + `<img class='star' src='static/img/star.png'>` +
              `<img id='maze' src='static/img/h2s${trial_arm}.png'/>
            <p class='bottom'>You found another star, but it was cancelled out by an anti-star.
            <br>Try your best to collect stars while avoiding anti-stars.</p>\`</p>`;
        }
      }
      if (trial.trial == 0) { // first trial - don't show points until they're gotten
        if (saw_T0_inst == 0) {
          trial.stimulus = `<img id='maze' src='static/img/h2s${trial_arm}.png'/>
                <p class='bottom'>Well done, you got Alex to an arm of the maze!
                In each arm of the maze, there is a star to be collected.<br>
                Try pressing [W,E,R,U,I,O] to collect the star!</p>`;
        } else {
          trial.stimulus = blobs + `<img id='maze' src='static/img/h2s${trial_arm}.png'/>` +
              `<p class='bottom'>If you press the wrong key for the maze arm, you collect an <b>anti-star</b> instead of a <b>star</b>.
                <br>Try pressing another key [W,E,R,U,I,O] to collect the star!</p>`;
        }
        trial.incorrect_text = `<img id='maze' class='faded' src='static/img/h2s${trial_arm}.png'/>` + faded_blobs;
      } else if (trial.trial == 1) {
        if (saw_T1_inst == 0) {
          trial.stimulus = `<p id='points'>Points:&emsp;<b>${pts}</b></p><img id='maze' src='static/img/h2s${trial_arm}.png'/>
                <p class='bottom'>Well done, you got Alex to an arm of the maze! In each arm of the maze, there is a star to be collected.
                The way to collect a star can be different in each arm. Try to press keys to collect the star in this arm!</p>`;
        } else {
          trial.stimulus = `<p id='points'>Points:&emsp;<b>${pts}</b></p>` + blobs + `<img id='maze' src='static/img/h2s${trial_arm}.png'/>
               <p class='bottom'>If you press the wrong key, you will collect an anti-star.
                <br>Try pressing another key [W,E,R,U,I,O] to collect the star!</p>`;
        }
      } else {
        trial.stimulus = `<p id='points'>Points:&emsp;<b>${pts}</b></p>` + blobs + `<img id='maze' src='static/img/h2s${trial_arm}.png'/>`;
      }
      trial.key_answer = maze_info.keys[trial_arm-1];
      trial.data.key_answer = maze_info.keys[trial_arm-1];
    };

    let T_trial = { // trial object for third (getting a point in arm)
      type: "categorize-html",
      stimulus: `<img id='maze' src='static/img/h2.png'/>`,
      on_start: create_T_Stim,
      // on_load: fadeInLastBlob,
      on_finish: data => {
        saw_T0_inst = 1;
        console.log(data);
        if (data.trial==1) saw_T1_inst = 1;
      },
      trial_duration: MAX_RT,
      condition: maze_info.condition,
      block: maze_info.block,
      trial: i,
      choices: maze_info.keys,
      timeout_message: TIMEOUT_MSG,
      timeout_message_duration: T_timeout_message_duration,
      show_stim_with_feedback: false,
      correct_feedback_duration: T_star_message_duration_short, // just for instructions
      incorrect_feedback_duration: T_ITI,
      animate_incorrect_feedback: incorrectAnim,
      animate_correct_feedback: correctAnim,
      correct_anim_duration: starAnim_ITI,
      stage: 3,
      data: {
        maze: maze_info.name,
        block: maze_info.block,
        trial: i,
        arm: maze_info.arm[i],
        stage: 3,
        reversed_arm: maze_info.reversed_arms,
        hierarchy: maze_info.hierarchy,
        attempt: attempt
      },
    };


    let F_loop = { // loop first stage while they haven't pressed the correct key
      timeline: [F_trial],
      loop_function: data => {

        if (data.values()[0].key_press == null) {
          no_response++;
        }
        if (no_response >= no_response_threshold) {
          kill_check = 1;
        }
        console.log(no_response);

        counter1++;
        data.values()[0].num_presses_this_trial = counter1;
        data.values()[0].stage_trial = counter1;
        if (counter1 == 10) {
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

    var S_loop = { // loop second stage while they haven't pressed the correct key
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
        data.values()[0].stage_trial = counter2;
        if (counter2 == 10) {
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
      stimulus: `<img id='maze' src='static/img/h2.png'/>`,
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

    let T_loop = { // loop third stage while they haven't pressed the correct key
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
          data.values()[0].stage_trial = counter3;
          if (counter3 == 10) {
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
      stimulus: `<img id='maze' src='static/img/h2.png'/>`,
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

    block_timeline.push(pre_ITI);
    block_timeline.push(F_loop); // loop F stage
    block_timeline.push(F_if_node_nomorechances); // check if out of F chances
    block_timeline.push(if_node_FtoS); // transition to S stage and loop
    block_timeline.push(S_if_node_nomorechances); // check if out of S chances
    block_timeline.push(if_node_StoT); // transition to T stage and loop
    block_timeline.push(T_if_node_nomorechances); // check if out of T chances
    block_timeline.push(ITI);

  }

  return block_timeline;

}
