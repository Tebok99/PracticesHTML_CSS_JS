/**
 * 
 */
var timeoutId = null;
var timeIntervalId = null;

// 알 click event listener 활성/비활성 상태를 조정하는 변수
var clickEventSwitch = false;

// 배경음, 효과음 로딩 (사용자 정의 객체로 작성)
var audioSource = {
	audioBgm : (function() {
		var audio = new Audio("media/puzzle puyo bgm.mp3");
		audio.volume = 0.3;
		audio.loop = true;
		return audio;
	})(),
	audioGameStart : new Audio("media/tada.mp3"),
	audioTictoc : new Audio("media/clock.mp3"),
	audioFail : new Audio("media/bad.mp3"),
	audioCorrect : new Audio("media/chimes.mp3"),
	audioWinner : new Audio("media/ending.mp3"),
	audioLooser : new Audio("media/looser.mp3")
}

document.body.onload = function loading() {
	// 24개 알들 id:main에 배치
	var div;
	var main = document.getElementById("main");
	for (var i=0; i<24; i++) {
		div = document.createElement("div");
		div.setAttribute("class", "default");
		div.setAttribute("id", "egg"+i);
		main.appendChild(div);
	}

	// 게임 시작, 종료 버튼 활성화
	var button = document.getElementById("button");

	if (!button.onclick) {
		button.onclick = function() {
			if (button.innerHTML == "게임 시작") {
				start();
				button.innerHTML = "게임 그만하기";
			}
			else {
	 			timeId = setTimeout(stop, 500);	// 게임 종료 선언
				button.innerHTML = "게임 시작";
			}
		};
	}
};

function initialize() {
	// 알 <div> 모양 초기화, id:dialog 영역 초기화, gameover 삭제
	// 알 모양 초기화
	var eggs = document.getElementById("main").getElementsByTagName("div");
	var eggsLength = eggs.length;
	for (var i = 0; i<eggsLength; i++ ) {
		eggs[i].setAttribute("style", "");
		eggs[i].setAttribute("class", "default");
	}

	// gameover 삭제
	var gameover = document.getElementById("gameover");
	if (gameover != null) {
		document.getElementById("main").removeChild(gameover);
	}
		
	// 남은수, 실패수, 시간, 메시지 초기화
	var remainsValue = document.getElementById("remainsValue");
	remainsValue.innerHTML = "8";
	
	var failsValue = document.getElementById("failsValue");
	failsValue.innerHTML = "0";

	var timeValue = document.getElementById("timeValue");
	timeValue.innerHTML = "0";
	
	var message = document.getElementById("message");
	message.innerHTML = "강아지를 찾아보세요.";
};

function start() {
	// 정답만들기. 0~23 숫자 중 중복없이 8회 숫자 뽑아 배열변수에 저장
	var answer = [];
	for (var i=0; i<8; i++) {
		var random = Math.floor(Math.random() * 24);
		if(answer.includes(random)) {
			// 배열 내에 임의의 값이 존재하면 for 조건변수를 1감소
			i--;			
		}
		else {
			answer[i] = random;
		}
	}

	// 초기화 실행(initialize())
	initialize();

	// 배경음악 재생
	audioSource.audioBgm.play();
	
	// 게임 시작 효과음 재생
	audioSource.audioGameStart.play();

	// 10초 동안 정답 확인시켜 주기 (showAndPlay());
	// 10초 정답확인 후 바로 게임시작. egg마다 click 이벤트 리스너 작성
	showAndPlay(answer);
}

function stop() {
	// 종료 여부를 최종 확인하는 단계 return confirm() 구현은 할 수 있을까?
	// 게임 종료 메시지 표시
	var message = document.getElementById("message");
	message.innerHTML = "게임을 종료합니다.";
	
	// 초기화 실행(initialize())
	if(timeoutId != null) {
		clearTimeout(timeoutId);
		timeoutId = null;
	}
	if(timeIntervalId != null) {
		clearInterval(timeIntervalId);
		timeIntervalId = null;
	}
	//	console.log("stop후: " + timeoutId + " " + timeIntervalId);
	
	// 알 click event listener 비활성
	clickEventSwitch = false;

	// 게임 시작 버튼으로 변경
	var button = document.getElementById("button");
	button.innerHTML = "게임 시작";

	// 배경음악 다시 로딩
	audioSource.audioBgm.load();
}

function check(obj, answer) {
	// egg을 선택할 때에 강아지가 있는지 확인하는 함수
	// 선택한 알의 id값으로 정답 여부 확인
	// 강아지가 있다면 성공그림, 남은수 1감소, 찾았다는 메시지
	// 남은수가 0이라면, 모두찾기 성공
	// 강아지가 없다면 실패그림, 실패수 1증가, 안타까워하는 메시지
	// 실패수가 5 초과하면, 찾기 실패 게임 종료
	var remainsValue = document.getElementById("remainsValue");
	var message = document.getElementById("message");
	var failsValue = document.getElementById("failsValue");
	
	return function () {
		// click event listener 비활성 상태이면 실행 종료
		if (!clickEventSwitch) return;

		// 이미 선택한 알은 제외
		if (obj.getAttribute("class") != "default") return;

		if ( answer.includes( parseInt(obj.id.split("egg")[1]) ) ) {
			// 선택한 알에 강아지가 있다면
			obj.setAttribute("class", "success");
			remainsValue.innerHTML = parseInt(remainsValue.innerHTML) - 1;
			
			if (remainsValue.innerHTML == "0") {
				// 모든 강아지를 찾았다면
				audioSource.audioBgm.pause();
				audioSource.audioWinner.play();
				message.innerHTML = "모두 찾았어요. 성공!";
				
				// 알 click event listener 비활성
				clickEventSwitch = false;

				timeoutId = setTimeout(stop, 3000);	// 게임 종료 선언
			}
			else {
				audioSource.audioCorrect.play();
				
				message.innerHTML = "찾았어요!";
			}
		}
		else {	// 선택한 알에 강아지 없을 때
			obj.setAttribute("class", "failed");
			
			if (failsValue.innerHTML === "4") {
				audioSource.audioBgm.pause();
				audioSource.audioLooser.play();
				message.innerHTML = "찾기를 실패했네요.";

				// 알 click event listener 비활성
				clickEventSwitch = false;

				// 정답확인 validateResult(answer)
				validateResult(answer);

				// game over 화면 중앙에 출력
				gameover();
				
				timeoutId = setTimeout(stop, 3000);	// 게임 종료 선언
			}
			else {
				audioSource.audioFail.play();
				failsValue.innerHTML = parseInt(failsValue.innerHTML) + 1;
				message.innerHTML = "강아지가 어딨을까요?";
			}
		}
	};
}

function showAndPlay(answer) {
	// 10초간 정답 보여주기, 남은 5초 동안 곧 게임시작 알리는 메시지 출력
	var message = document.getElementById("message");
	var timeValue = document.getElementById("timeValue");
	var eggs = document.getElementById("main").getElementsByTagName("div");
	
	var limitedSeconds = 10;	// 정답을 잠시 보여주는 시간 설정
	message.innerHTML = "강아지 위치를 기억해두세요.(" + limitedSeconds + "초 전)";
	
	// console.log(answer);
	// 정답 미리 보여주기
	if (answer != null) {
		answer.forEach( function(item) {
			eggs[item].setAttribute("class", "success");
		});
	}
	else {
		alert("parameter error");
		return;
	}

	// egg 객체마다 click 이벤트 리스너 작성
	var eggsLength = eggs.length;
	for (var i=0; i<eggsLength; i++) {
		eggs[i].onclick = check(eggs[i], answer);
	}
	
	// 1초 마다 메시지 출력, 시간 경과 후 정답을 가리고 알을 선택할 수 있도록 진행
	timeIntervalId = setInterval( function() {

		limitedSeconds--;
		// 5초 전까지 표시할 메시지 
		if (limitedSeconds > 5) {
			message.innerHTML = "강아지 위치를 기억해두세요.(" + limitedSeconds + "초 전)";
		}
		// 0초까지 표시할 메시지
		else if (limitedSeconds >= 0) {
			audioSource.audioTictoc.play();
			message.innerHTML = "곧 게임을 시작합니다.(" + limitedSeconds + "초 전)";
		}
		else {
			// 정답을 가리고, 알을 선택하여 게임진행. eggs에 click 이벤트 리스너 작성
			answer.forEach( function(item) {
				eggs[item].setAttribute("class", "default");
			});
			
 			if (timeIntervalId != null) {
 				clearInterval(timeIntervalId);
 			}
			
			// 알 선택하기 시작, 20초 카운트다운
			message.innerHTML = "시작!";
			
			// // click 이벤트 리스너 활성
			clickEventSwitch = true;
			
			// 20초 제한시간 진행. setInterval(timeOver(), 1000);
			limitedSeconds = 20;
			timeValue.innerHTML = limitedSeconds;
			timeIntervalId = setInterval(timeOver(limitedSeconds, answer), 1000);
		}
	}, 1000);	
}

function timeOver(time, answer) {
	// 제한시간 경과. 게임 종료. 종료 메시지 표시
	var timeValue = document.getElementById("timeValue");
	var eggs = document.getElementById("main").getElementsByTagName("div");
	
	if (Number.isNaN(time)) return;
	var limitedSeconds = time;

	return function () {
		if (limitedSeconds == 0) {

		audioSource.audioBgm.pause();
		audioSource.audioLooser.play();
		
		message.innerHTML = "시간이 모두 경과하였어요.";
		
		// 알 click event listener 비활성
		clickEventSwitch = false;

		// 정답확인 validateResult(answer)
		validateResult(answer);

		// game over 화면 중앙에 출력
		gameover();

		if (timeIntervalId != null) {
			clearInterval(timeIntervalId);
		}

		timeoutId = setTimeout(stop, 3000);	// 게임 종료 선언
		}
		else {
			limitedSeconds--;
			timeValue.innerHTML = limitedSeconds;
		};
	}	
}

function validateResult(answer) {	// 정답확인
	var eggs = document.getElementById("main").getElementsByTagName("div");
	if (answer != null) {
		answer.forEach( function(item) {
			if (eggs[item].getAttribute("class") == "default") {
				eggs[item].setAttribute("class", "success");
				eggs[item].setAttribute("style", "border: 1px solid red");
			}
		} );
	}
	else {
		alert("parameter error");
		return;
	}
}

function gameover() { 		// game over 화면 중앙에 출력
	var gameoverDiv = document.createElement("div");
	gameoverDiv.id = "gameover";
	gameoverDiv.innerHTML = "GAME OVER";
	document.getElementById("main").appendChild(gameoverDiv);
	timeoutId = setTimeout( function () {
		gameoverDiv.style.width = "100%";
		gameoverDiv.style.fontSize = "50px";
		gameoverDiv.style.left = "0px";
		gameoverDiv.style.top = "50%";
	}, 100);
}