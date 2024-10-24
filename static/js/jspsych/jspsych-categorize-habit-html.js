/**
 * jspsych plugin for categorization trials with feedback
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 **/


jsPsych.plugins['categorize-html'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'categorize-html',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML content to be displayed.'
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
      },
      correct_feedback_duration: {                  // SO modification
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Correct feedback duration',
        default: null,
        description: 'How long to show feedback if correct response.'
      },
      animate_correct_feedback: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'function that will animate correct feedback',
        default: null,
        description: 'If not null, function will be executed during feedback.'
      },
      correct_anim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'correct animation duration',
        default: null,
        description: 'How long to animate (by default equals correct_feedback_duration).'
      },
      incorrect_feedback_duration: {                // SO modification
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Incorrect feedback duration',
        default: null,
        description: 'How long to show feedback if incorrect response.'
      },
      animate_incorrect_feedback: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'function that will animate incorrect feedback',
        default: null,
        description: 'If not null, function will be executed during feedback.'
      },
      incorrect_anim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'animation duration',
        default: null,
        description: 'How long to animate (by default equals incorrect_feedback_duration).'
      },
      correct_feedback_proceed_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'correct feedback next key',
        default: null,
        array: true,
        description: 'The keys the subject is allowed to press to continue following correct feedback.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    display_element.innerHTML = '<div id="jspsych-categorize-html-stimulus" class="jspsych-categorize-html-stimulus">'+trial.stimulus+'</div>';

    // hide image after time if the timing parameter is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-categorize-html-stimulus').style.visibility = 'hidden';
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
        // replace default feedback duration if correct_feedback_duration is set
        if (trial.correct_feedback_duration !== null) {
          trial.feedback_duration = trial.correct_feedback_duration;
        }
      } else {
        // replace default feedback duration if incorrect_feedback_duration is set
        if (trial.incorrect_feedback_duration !== null) {
          trial.feedback_duration = trial.incorrect_feedback_duration;
        }
      }

      // // save data
      // trial_data = {
      //   "rt": info.rt,
      //   "correct": correct,
      //   "stimulus": trial.stimulus,
      //   "key_press": info.key
      // };
      //
      // display_element.innerHTML = '';
      //
      // var timeout = info.rt == null;
      // doFeedback(correct, timeout);

      trial_data = {
        "rt": info.rt,
        "correct": correct,
        "stimulus": trial.stimulus,
        "key_press": info.key,
        "condition": trial.condition,
        "block": trial.block,
        "trial": trial.trial,
        "stage": trial.stage
      };

      // console.log(trial_data);

      // display_element.innerHTML = '';

      var timeout = info.rt == null;
      doFeedback(correct, timeout, info);
    }

    jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'performance',
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

    function doFeedback(correct, timeout) {

      if (timeout && !trial.show_feedback_on_timeout) {
        display_element.innerHTML = trial.timeout_message;
        trial.feedback_duration = trial.timeout_message_duration; // amy added this using category-OT plugin code

      } else {
        // show image during feedback if flag is set
        if (trial.show_stim_with_feedback) {
          display_element.innerHTML = '<div id="jspsych-categorize-html-stimulus" class="jspsych-categorize-html-stimulus">'+trial.stimulus+'</div>';
        }

        // substitute answer in feedback string.
        var atext = "";
        if (correct) {
          atext = trial.correct_text.replace("%ANS%", trial.text_answer);
        } else {
          atext = trial.incorrect_text.replace("%ANS%", trial.text_answer);
        }

        // show the feedback
        display_element.innerHTML = '<div id="jspsych-categorize-html-stimulus" class="jspsych-categorize-html-stimulus">'+atext+'</div>';
        if (trial.animate_correct_feedback != null) {
          if (correct) {
            if (trial.correct_anim_duration == null) {
              trial.correct_anim_duration = trial.correct_feedback_duration;
            }
            trial.animate_correct_feedback(trial.correct_anim_duration);
          }
        }
        if (trial.animate_incorrect_feedback != null) {
          if (!correct) {
            if (trial.incorrect_anim_duration == null) {
              trial.incorrect_anim_duration = trial.incorrect_feedback_duration;
            }
            trial.animate_incorrect_feedback(trial.incorrect_anim_duration);
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
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });

      } else {
        if (correct && trial.correct_feedback_proceed_key != null) {
          function endTrialAfterResp(info) {
            jsPsych.pluginAPI.clearAllTimeouts();
            jsPsych.pluginAPI.cancelAllKeyboardResponses();
            endTrial()
          }
          jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: endTrialAfterResp,
            valid_responses: [trial.correct_feedback_proceed_key],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
          });
        }
        jsPsych.pluginAPI.setTimeout(function() {
          jsPsych.pluginAPI.clearAllTimeouts();
          jsPsych.pluginAPI.cancelAllKeyboardResponses();
          endTrial();
        }, trial.feedback_duration);
      }
    }

    function endTrial() {
      // display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    }

  };

  return plugin;
})();
