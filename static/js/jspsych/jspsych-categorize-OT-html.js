
jsPsych.plugins['categorize-OT-html'] = (function() {

  /*
  DOCUMENTATION

  categorize-OT-F displays one iteration of either the first stage (F) or second stage (S) in OT experiment

  In one iteration, participants see a shape. The goal is to learn to press 1 of 4
  keys in order to move on.

  categorize-OT requires the following variables:
  stimulus: the actual shape presented on the screen
  key_answer: the correct key to press
  possible_choices: array of possible choices
  correct_text: the feedback message when the choice is correct
  incorrect_text: the feedback message when the choice is incorrect
  timeout_message: the feedback message when the choice is not fast enough
  wrongkey_message: the feedback message when the choice is not inside choices
  trial_duration: the max amount of time for making a choice
  feedback_duration: how long the feedback message is shown


  categorize-OT was created by jimmyxia@berkeley.edu, based on code
  from Josh de Leuw's awesome jsPsych library.
  */

  var correct_audio = new Audio('static/audio/corrSound.wav');
  var incorrect_audio = new Audio('static/audio/incorSound.wav');

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('categorize-html', 'stimulus', 'image');

  plugin.info = {
    name: 'categorize-html',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image content to be displayed.'
      },
      key_answer: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key answer',
        default: undefined,
        description: 'The key to indicate the correct response.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        array: true,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      text_answer: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text answer',
        default: null,
        description: 'Label that is associated with the correct answer.'
      },
      correct_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Correct text',
        default: "<p class='feedback'>Correct</p>",
        description: 'String to show when correct answer is given.'
      },
      incorrect_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Incorrect text',
        default: "<p class='feedback'>Incorrect</p>",
        description: 'String to show when incorrect answer is given.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      force_correct_button_press: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Force correct button press',
        default: false,
        description: 'If set to true, then the subject must press the correct response key after feedback in order to advance to next trial.'
      },
      show_stim_with_feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true,
        no_function: false,
        description: ''
      },
      show_feedback_on_timeout: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show feedback on timeout',
        default: false,
        description: 'If true, stimulus will be shown during feedback. If false, only the text feedback will be displayed during feedback.'
      },
      timeout_message: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Timeout message',
        default: "<p>Please respond faster.</p>",
        description: 'The message displayed on a timeout non-response.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial'
      },
      feedback_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback duration',
        default: 2000,
        description: 'How long to show feedback.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    display_element.innerHTML = '<div id="jspsych-categorize-html-stimulus" class="jspsych-categorize-html-stimulus">'+trial.stimulus+'</div>';

    // hide image after time if the timing parameter is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-categorize-OT-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // if prompt is set, show prompt
    if (trial.prompt !== null) {
      display_element.innerHTML += trial.prompt;
    }

    var trial_data = {};

    // create response function
    var after_response = function(info) {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // clear keyboard listener
      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      var correct = false;
      if (trial.key_answer == info.key) {
        correct = true;
      }

      // var trial_FS = 1; // need new way of setting stage
      // if (trial.audio == 1) { // If audio = 1, that means the sound is up, which means it is the second stage.
      //   trial_FS = 2;
      // }

      // save data
      trial_data = {
        "rt": info.rt,
        "correct": correct,
        "stimulus": trial.stimulus,
        "key_press": info.key,
        "condition": trial.condition,
        "block": trial.block,
        "trial": trial.trial,
        // "stage": trial_FS
      };

      display_element.innerHTML = '';

      var timeout = info.rt == null;
      doFeedback(correct, timeout, info);
    }

    jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'date',
      persist: false,
      allow_held_key: false
    });

    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        after_response({
          key: null,
          rt: null
        });
      }, trial.trial_duration);
    }

    function doFeedback(correct, timeout, info) {

      var feedback_duration = trial.feedback_duration;

      if (timeout && !trial.show_feedback_on_timeout) {
        display_element.innerHTML += trial.timeout_message;
        feedback_duration = trial.timeout_message_duration;
      } else {
        // show image during feedback if flag is set
        if (trial.show_stim_with_feedback) {
          display_element.innerHTML = '<img id="jspsych-categorize-OT-stimulus" class="jspsych-categorize-OT-stimulus" src="'+trial.stimulus+'"></img>';
        }

        // Jimmy's code:

        if (!trial.possible_choices.includes(String.fromCharCode(info.key).toLowerCase())) {
          display_element.innerHTML += trial.wrongkey_message;
          feedback_duration = trial.wrongkey_message_duration;
        }

        // substitute answer in feedback string.
        if (correct) {
          display_element.innerHTML = trial.correct_text;
          if (trial.audio == 1) {
            correct_audio.play();
          }
        } else {
          if (!trial.possible_choices.includes(String.fromCharCode(info.key).toLowerCase())) {
            display_element.innerHTML = trial.wrongkey_message;
            feedback_duration = trial.wrongkey_message_duration;
          } else {
            display_element.innerHTML = trial.incorrect_text;
            if (trial.audio == 1) {
              incorrect_audio.play();
            }
          }
        }
      }


      // check if force correct button press is set
      if (trial.force_correct_button_press && correct === false && ((timeout && trial.show_feedback_on_timeout) || !timeout)) {

        var after_forced_response = function(info) {
          endTrial();
        }

        jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_forced_response,
          valid_responses: [trial.key_answer],
          rt_method: 'date',
          persist: false,
          allow_held_key: false
        });

      } else {
        jsPsych.pluginAPI.setTimeout(function() {
          endTrial();
        }, feedback_duration);
      }

    }

    function endTrial() {
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    }

  };

  return plugin;
})();
