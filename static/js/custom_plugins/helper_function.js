// helper functions for the task

let computeB = function(value) {
	let bp = (value-0.1)/(0.9-0.1) * 3;
	if (bp > 3) {
		bp = 3;
	} else if (bp < 0) {
		bp = 0;
	}
	return bp
}

let fadeInLastBlob = function(duration=200) {
	const blobArray = document.querySelectorAll(".blob");
	if (blobArray.length > 0) {
		let lastBlob = blobArray[blobArray.length-1];
		anime({
			targets: [lastBlob],
			opacity: [0, getComputedStyle(lastBlob).opacity],
			duration: duration,
			loop: false,
			easing: 'linear',
		});
	}
}
let vibrateMaze = function(duration=20) {
	anime({
		targets: [document.getElementById('maze')],
		translateX: [-5,0],
		duration: duration,
		direction: 'alternate',
		loop: duration/3,
		easing: 'easeOutBack',
	});
}

let showPoint = function(duration=1000) {
	let t = anime.timeline({
		targets: [document.getElementById('outcome')],
		loop: false,
		duration: duration
	});
	t.
	add({
		opacity:[0,1],
		duration: duration-200
	}, 0).
	add({
		opacity:[1, 0],
		translateY: [0, -20],
		easing: 'linear',
		duration: 200
	}, duration-200);
}

let incorrectAnim = function(duration) {
	fadeInLastBlob(duration)
	vibrateMaze(duration/4)
}

let correctAnim = function(duration, point=true) {
	if (point) {
		showPoint(duration)
	}
	const blobArray = document.querySelectorAll(".blob");
	const starArray = document.querySelectorAll(".star");

	let t = anime.timeline({
		loop: false,
		duration: duration
	});
	for (let i=0; i<starArray.length; i++) {

		if (blobArray.length > i){
			t.add({	// fade out star + blob
				targets: [starArray[i]],
				opacity: [getComputedStyle(starArray[i]).opacity, 0],
				duration: fade_ITI,
				loop: false,
				easing: 'linear',
			}, 0);
			t.add({
				targets: [blobArray[i]],
				opacity: [getComputedStyle(blobArray[i]).opacity, 0],
				duration: fade_ITI,
				loop: false,
				easing: 'linear',
			}, 0);
		} else {
			setTimeout(function(){ // increment points
				let ptsHTML = document.getElementById('points');
				if (ptsHTML) {
					ptsHTML = document.getElementById('points').innerHTML;
					let regexMatch = ptsHTML.match(/\d+/);
					if (regexMatch) {
						let ptsStr = regexMatch[0];
						let pts = parseInt(ptsStr);
						let newPtsStr = String(pts + 1);
						ptsHTML = ptsHTML.substring(0, regexMatch.index) + newPtsStr + ptsHTML.substring(regexMatch.index + ptsStr.length);
						document.getElementById('points').innerHTML = ptsHTML;
					}
				}
			}, duration-200);
			t.add({ // grow star
				targets: [starArray[i]],
				scaleX: [0, 1],
				scaleY: [0, 1],
				easing: 'easeOutElastic(1, .6)',
				duration: 200
			}, 0).add({ // wiggle gem
				targets: [starArray[i]],
				rotate: [-7, 0],
				easing: 'easeOutElastic(2, .6)',
				duration: 250
			}, 50)
			t.
			add({ // fade gem and outcome up and out
				targets: [starArray[i]],
				opacity:[1, 0],
				translateY: [0, -10],
				easing: 'linear',
				duration: 50}, duration-50)
		}
	}

	// if (blobArray.length > 0) { // points got cancelled
	//
	// } else { // won point
	//
	// }
}
let animTestPractFB = function() {
	correctAnim(duration=T_star_message_duration_testPract, point=false)
}

// random int generator
const getRandomInt = function(min, max) {
	min = Math.ceil(min);
  	max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mean(numbers) {
  var total = 0, i;
  for (i = 0; i < numbers.length; i += 1) {
      total += numbers[i];
  }
  return total / numbers.length;
}

// shuffle helper fn
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

// generate maze and arm sequences for the final stage with two people
let gen_arm_name_hier_sequence_pract = function(num_pres_per_arm) {
	let arm_seq = [3,4,5,6,3,4,5,6];
	let name_seq = [0,0,0,0,1,1,1,1];
	let hier_seq = [2,2,2,2,2,2,2,2];
	let all_arm_seq = []; let all_name_seq = []; let all_hier_seq = [];
	for (i = 0; i < num_pres_per_arm; i++) {
		let temp = shuffle([...Array(arm_seq.length).keys()]);
		temp.forEach(e => all_arm_seq.push(arm_seq[e]));
		temp.forEach(e => all_name_seq.push(name_seq[e]));
		temp.forEach(e => all_hier_seq.push(hier_seq[e]));
	}
	return [all_arm_seq, all_name_seq, all_hier_seq];
}

let gen_arm_name_hier_sequence = function(num_pres_per_arm_both_con, ratio=1) {
	let all_arm_seq = []; let all_name_seq = []; let all_hier_seq = [];
	for (pres = 0; pres < num_pres_per_arm_both_con; pres ++) {
		let arm_seq = [3,4,5,6];
		for (i = 0; i < ratio-1; i++) {
			arm_seq = arm_seq.concat((action_keys_cam.reversed_arms).map(x=>[1,2,3,4,5,6][x]));
		}
		let name_seq = (Array(arm_seq.length).fill(0)).concat(Array(arm_seq.length).fill(1));
		let hier_seq = Array(name_seq.length).fill(2);
		arm_seq = Array(2).fill(arm_seq).flat();

		let temp = shuffle([...Array(arm_seq.length).keys()]);
		temp.forEach(e => all_arm_seq.push(arm_seq[e]));
		temp.forEach(e => all_name_seq.push(name_seq[e]));
		temp.forEach(e => all_hier_seq.push(hier_seq[e]));
	}
	return [all_arm_seq, all_name_seq, all_hier_seq];
}

let gen_arm_sequence = function(num_pres_per_arm) {
	let arm_seq = [];

	for (i = 0; i < num_pres_per_arm; i++) {
		arm_seq.push(shuffle([3,4,5,6]));
	}
	arm_seq = arm_seq.flat();
	return arm_seq;
}

let gen_hier_sequence = function(len, vals=[0,1,2]) {
	if (! Array.isArray(vals)) {
		vals = [vals];
	}
	let hier_seq = [];
	while (hier_seq.length < len) {
		hier_seq.push(shuffle(vals));
	}
	hier_seq = hier_seq.flat();
	return hier_seq.slice(0,len);
}

function reorderArraysByIndexArray(array1, array2, indexArray) {
	// Combine the arrays into an array of tuples
	let combined = indexArray.map((index, i) => [array1[i], array2[i], index]);
	// Sort the combined array based on the third element of each tuple (the index)
	combined.sort((a, b) => a[2] - b[2]);
	// Extract the first and second elements of each tuple into separate arrays
	let newArray1 = combined.map(tuple => tuple[0]);
	let newArray2 = combined.map(tuple => tuple[1]);
	return [newArray1, newArray2];
}

// get keys to use for alex by shuffling the base keys
let randomize_key_order = function(keys, names) {
	let new_idx = shuffle([0,1,2,3,4,5]);
	let shuffled_keys = [];
	let shuffled_names = [];
	for (i = 0; i < new_idx.length; i++) {
		shuffled_keys.push(keys[new_idx[i]]);
		shuffled_names.push(names[new_idx[i]]);
	}
	let to_swap = shuffle([2,3,4,5]).slice(0,2);
	let rev_keys = shuffled_keys.map((x) => x);
	let rev_names = shuffled_names.map((x) => x);
	console.log(`reversed arms: ${to_swap[0]+1} and ${to_swap[1]+1}`);
	rev_keys[to_swap[0]] = shuffled_keys[to_swap[1]]; // replace first arm
	rev_keys[to_swap[1]] = shuffled_keys[to_swap[0]]; // replace second arm
	// do the same for names
	rev_names[to_swap[0]] = shuffled_names[to_swap[1]]; // replace first arm
	rev_names[to_swap[1]] = shuffled_names[to_swap[0]]; // replace second arm
	return {
		action_keys: {
			keys: shuffled_keys,
			names: shuffled_names,
		},
		action_keys_cam: {
			keys: rev_keys,
			names: rev_names,
			reversed_arms: to_swap+1
		}
	}
}

// // get keys to use for cameron by shuffling the base keys
// let get_rev_keys = function(shuffled_keys,shuffled_names) {
// 	let to_swap = shuffle([2,3,4]).slice(0,2);
// 	let rev_keys = shuffled_keys.map((x) => x);
// 	let rev_names = shuffled_names.map((x) => x);
// 	console.log(`reversed arms: ${to_swap[0]+1} and ${to_swap[1]+1}`);
// 	rev_keys[to_swap[0]] = shuffled_keys[to_swap[1]]; // replace first arm
// 	rev_keys[to_swap[1]] = shuffled_keys[to_swap[0]]; // replace second arm
// 	// do the same for names
// 	rev_names[to_swap[0]] = shuffled_names[to_swap[1]]; // replace first arm
// 	rev_names[to_swap[1]] = shuffled_names[to_swap[0]]; // replace second arm
// 	const rev = {
// 		keys: rev_keys,
// 		names: rev_names,
// 		reversed_arms: to_swap,
// 	}
// 	console.log('cameron keys');
// 	console.log(rev);
// 	return rev;
// }

// return elements of arr greater than num
let returnGT = (arr, num) => {
	return arr.filter(function(x) {
		return x > num
	})
}
let returnLT = (arr, num) => {
	return arr.filter(function(x) {
		return x < num
	})
}

// compute average of array
const average = array => array.reduce((a, b) => a + b) / array.length;