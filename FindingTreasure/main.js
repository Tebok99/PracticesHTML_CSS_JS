var width = 0;
var height = 0;
var imgDiagonal = 0;
var target = null;
var clicks = 0;

var getRandomNumber = function (size) {
    return Math.floor(Math.random()*size);
};

var setTargetPoint = function () {
    return {
        x : getRandomNumber(width),
        y : getRandomNumber(height)
    }
};

var getImageSize = function (img) {
    width = img.width;
    height = img.height;
    imgDiagonal = Math.sqrt((width*width) + (height*height));
};

var getDistance = function (event, target) {
    var diffX = event.offsetX - target.x;
    var diffY = event.offsetY - target.y;
    return Math.sqrt((diffX * diffX) + (diffY * diffY));
};

var getDistanceHint = function (distance) {
    if (distance < imgDiagonal / 50) {
        return "바로 앞입니다.";
    }
    else if (distance < imgDiagonal / 25) {
        return "정말 가까워요";
    }
    else if (distance < imgDiagonal / 12.5) {
        return "가까워요";
    }
    else if (distance < imgDiagonal / 6.75) {
        return "멀지는 않아요";
    }
    else if (distance < imgDiagonal / 3.375) {
        return "멀어요";
    }
    else if (distance < imgDiagonal / 1.6875) {
        return "꽤 멀어요";
    }
    else if (distance < imgDiagonal / 1.34875 ) {
        return "정~~말 멀어요!";
    } else {
        return "엉뚱한 곳이에요!";
    }
};

// 클릭한 곳에 해골 이미지 추가하기
var setClickImage = function (event) {
    var img = new Image(30);
    img.src = "http://m1.daumcdn.net/cfile206/R400x0/124F3F244CC531F84EA8B6";
    img.addEventListener("load", function () {
        img.style.left = event.layerX + "px";
        img.style.top = event.layerY + "px";
        document.getElementById("overlay").appendChild(img);
    });
}

// 게임 초기화
var init = function() {
    clicks = 0;
    document.getElementById("overlay").innerHTML = "";
    document.getElementById("distance").innerHTML = "자, 보물을 찾아볼까요?";
}

// 이미지 목록에서 보물 찾기 지도 이미지 선택하기
document.getElementById("mapList").addEventListener("click", function(event) {
    // console.log(event.target);
    if (event.target.tagName == "INPUT") {
        document.getElementById("map").src = event.target.src;
    }
});

// 보물지도가 로딩되면, 이미지의 크기와 보물위치를 저장. 그리고 게임을 초기화
document.getElementById("map").addEventListener("load", function () {
    getImageSize(this);
    target = setTargetPoint();

    // clicks 초기화, 클릭 표시 해골이미지 삭제, 메시지 삭제
    init();
    
    // console.log(target);
} );

document.getElementById("map").addEventListener("click", function(event) {
    clicks ++;
    if (clicks === 20) {
        distanceHint = "GAME OVER";
    }
    else {
        // 클릭한 위치를 표시해 줍니다.
        setClickImage(event);

        // 클릭한 위치에서 보물까지의 거리 계산
        var distance = getDistance(event, target);
    
        // 이미지 대각선 길이 1.2% 이내에 위치한다면 보물을 찾은 것
        if (distance < imgDiagonal / 84) {
            alert(clicks + "번 클릭해서 보물을 찾았어요!");
            distanceHint = "좌표는 (" + target.x + ", " + target.y + ") 입니다.";
        }
        else {
            // 플레이어에게 얼마나 가까운지 말해주기
            var distanceHint = getDistanceHint(distance);        
        }
    }
    // 보물을 찾았는지?
    document.getElementById("distance").innerHTML = distanceHint + ", 남은 클릭 수: " + (20-clicks);
});