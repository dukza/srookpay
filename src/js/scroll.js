(()=>{
    let btnTop = document.querySelector('.jBtn-top');
    let yOffset = 0; //pageYOffset
    let prevScrollHeight = 0; // 이전 스크롤 합
    let currentScene = 0; //활성화된 scene
    let enterNewScene = false; // 새로운 scene이 시작되는 순간
    const sceneInfo = [
        {

            //0
            type: "normal",
            scrollHeight: 0,
            objs: {
                container: document.querySelector('.jScroll00'),
                btnTop: document.querySelector('.jBtn-top'),

                
            }
        },
        {
            //1
            type: "normal",
            scrollHeight: 0,
            objs: {
                container: document.querySelector('.jScroll01'),
                jMockup: document.querySelector('.jScroll01 .jMockup'),
                jCount01: document.querySelector('.jScroll01 .jCount01'),
                jCount02: document.querySelector('.jScroll01 .jCount02'),
             
            }
        },
        {
            //2
            type: "normal",
            scrollHeight: 0,
            objs: {
                container: document.querySelector('.jScroll02'),
                jMockup: document.querySelector('.jScroll02 .jMockup'),
                jCount01: document.querySelector('.jScroll02 .jCount01'),
                jCount02: document.querySelector('.jScroll02 .jCount02'),
            }
        },
        {  
            // 3 
            type: "normal",
            scrollHeight: 0,
            objs: {
                container: document.querySelector('.jScroll03'),
                jMockup: document.querySelector('.jScroll03 .jMockup'),
                jCount01: document.querySelector('.jScroll03 .jCount01'),
                jCount02: document.querySelector('.jScroll03 .jCount02'),
            }
        }, 
        {   
            // 4
            type: "normal",
            scrollHeight: 0,
            objs: {
                container: document.querySelector('.jScroll04'),
            }
        }                
    ];

    Number.prototype.format = function(){
        if(this==0) return 0;
    
        var reg = /(^[+-]?\d+)(\d{3})/;
        var n = (this + '');
    
        while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
    
        return n;
    };

    // function countUp(obj,count){
    //     var maxCount = count,   // ex) maxCount = 1,000
    //         speedArea = parseInt(maxCount * 0.90),   // 가속도 구간   ex) speedArea = 900
    //         runCount = 0,   // 카운트값 
    //         speed = 10;     // 속도로 쓸꺼임.

    //     var int = setInterval(function() {
    //         console.log('countup');
    //         if(runCount < maxCount) {   // 카운트 값이 최대값 이전 이면   ex)  if( 카운트값 < 1,000 ) 일때만.
    //             if(runCount < speedArea) {  // 카운트 값이 가속도 구간 이전이면   ex)  if( 카운트값 < 900)
    //                 runCount = runCount + ( speedArea * ( speed / 100 ));  
    //             }else {  // 카운트 값이 가속도구간 이상이면 1씩 증가 
    //                 runCount++;
    //             }
    //             obj.innerHTML = runCount.format();
    //         }else{  // 카운트값(runCount)이  maxCount 이면 실행 종료
    //             clearInterval(int);
    //         }
    //     }, 5);
    // }

    function countUp(target_frame, target_number) {
        this.count = 0; this.diff = 0;
        this.target_count = parseInt(target_number);
        this.target_frame = target_frame;
        this.timer = null;
        this.counter();
    };

    countUp.prototype.counter = function() {
        var self = this;
        this.diff = this.target_count - this.count;
         
        if(this.diff > 0) {
            self.count += Math.ceil(this.diff / 5);
        }
         
        this.target_frame.innerHTML = this.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
         
        if(this.count < this.target_count) {
            this.timer = setTimeout(function() { self.counter(); }, 20);
        } else {
            clearTimeout(this.timer);
        }
    };
    
    //각 로딩, 리사이즈 시 scene을 셋팅
    function setLayout() {
        
        // 1. sceneInfo[i].scrollHeight 기본값 설정
        for (let i = 0; i < sceneInfo.length; i++) {
            // 스크롤을 이용한 인터랙션 구현 / 자잘한 수정사항들 처리
            if (sceneInfo[i].type === "sticky") {
                // 화면 높이 * heightNum
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
                // console.log('setLayOut() sticky :'  + sceneInfo[i].scrollHeight);
                sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
            } else if (sceneInfo[i].type === "normal") {
                // container 크기
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.scrollHeight;
                // console.log('setLayOut() normal :' + i + ' / ' + sceneInfo[i].scrollHeight);
                // console.log(sceneInfo[i].objs.container.offsetHeight)
            }
            // container 크기
        }

        // 2. 현재 scene구하기: 현재 scene에 해당하는 애니메이션
        // 스크롤을 이용한 인터랙션 구현/ 현재 활성 씬 반영하기 9:13

        // 스크롤 높이
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            // yOffset이 totalScrollHeight 보다 작을때까지 만 break
            if (totalScrollHeight > yOffset) {
                currentScene = i;
                break;
            }
        }
        // body에 클래스 넣기
        document.body.setAttribute("id", `show-scene-${currentScene}`); 
    }    
    // 움직임 계산(적용 값, 현재 scene 스크롤 위치)
    // function calcValues(values, currentYOffset) {
    //     let rv;
    //     const scrollHeight = sceneInfo[currentScene].scrollHeight;
    //     // scrollRatio
    //     // 스크롤을 이용한 인터랙션 구현/ 스크롤 애니메이션 구현 3
    //     // 스크롤 진행율 = 현재 스크롤 된 값 / 현재 scene의 컨텐츠 높이
    //     const scrollRatio = currentYOffset / scrollHeight;
    //     // 스크롤을 이용한 인터랙션 구현/ 특정 타이밍 스크롤 애니메이션 기능 추가 5:25
    //     // 적용값 인덱스 3이 있는 경우: 부분 스크롤 효과

    //     if (values.length === 3) {
    //         // 시작점
    //         const start = values[2].start * scrollHeight;
    //         // 끝점
    //         const end = values[2].end * scrollHeight;
    //         // 애니메이션 재생 구간
    //         const keyframes = end - start;
    //         // 스크롤을 이용한 인터랙션 구현/ 특정 타이밍 스크롤 애니메이션 기능 추가 10:30
    //         if (currentYOffset >= start && currentYOffset <= end) {
    //             // 반영 값 = 진행율 * 적용 값
    //             rv =
    //             ((currentYOffset - start) / keyframes) * (values[1] - values[0]) +
    //             values[0];
    //             // start 위 위치
    //         } else if (currentYOffset < start) {
    //             rv = values[0];
    //             //end 아래 위치
    //         } else if (currentYOffset > end) {
    //             rv = values[1];
    //         }
    //         } else {
    //         // 전체 scene 반영
    //         // 반영 값 = 진행율 * 적용 값
    //         rv = scrollRatio * (values[1] - values[0]) + values[0];
    //     }

    //     return rv;
    // }
    // 각 scene에서 움직임 선언
    function playAnimation() {
        
        // 현재 scene의 변경 객체
        const objs = sceneInfo[currentScene].objs;
        // 현재 scene 적용 값
        const values = sceneInfo[currentScene].values;
        // 현재 scene에서 스크롤 위치
        const currentYOffset = yOffset - prevScrollHeight;
        //스크롤을 이용한 인터랙션 구현/ 특정 타이밍 스크롤 애니메이션 적용하기 12:28
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        //현재 scene 분기 처리
        // console.log('currentScene',currentScene)
        switch (currentScene) {
            
        case 0:
            // 탭
            if(scrollRatio > 0 && scrollRatio < 0.7){
                sceneInfo[1].objs.jMockup.style.opacity = `0`;
                sceneInfo[1].objs.jMockup.style.transform = `translateY(10rem)`;
                
            }else{
                if(sceneInfo[1].objs.jMockup.style.opacity  != 1) { // jMockup 의 opacity 가 '0' 이면 jMockup의 애니메이션과 숫자 카운트를 실행
                    sceneInfo[1].objs.jMockup.style.opacity = `1`;
                    sceneInfo[1].objs.jMockup.style.transform = `translateY(-10rem)`;
                    // console.log(sceneInfo[1].objs.jCount01)
                    new countUp(sceneInfo[1].objs.jCount01,123153066); 
                    new countUp(sceneInfo[1].objs.jCount02,123153066);                
                } 
                
            }
            // if(scrollRatio < 0.5){  
            //     // console.log('0')
            //    sceneInfo[0].objs.btnTop.style.opacity = `0`; 
            // }     
        break;
        case 1:
            // 탭
            if(scrollRatio > 0 && scrollRatio < 0.7){
                sceneInfo[2].objs.jMockup.style.opacity = `0`;
                sceneInfo[2].objs.jMockup.style.transform = `translateX(10rem)`;
            }else{
                if(sceneInfo[2].objs.jMockup.style.opacity  != 1) { // jMockup 의 opacity 가 '0' 이면 jMockup의 애니메이션과 숫자 카운트를 실행
                    sceneInfo[2].objs.jMockup.style.opacity = `1`;
                    sceneInfo[2].objs.jMockup.style.transform = `translateY(-10rem)`;
                    // console.log(sceneInfo[1].objs.jCount01)
                    new countUp(sceneInfo[2].objs.jCount01,123153066); 
                    new countUp(sceneInfo[2].objs.jCount02,123153066);                
                }                 
            }
        break;
        case 2:
            // 탭
            if(scrollRatio > 0 && scrollRatio < 0.7){
                sceneInfo[3].objs.jMockup.style.opacity = `0`;
                sceneInfo[3].objs.jMockup.style.transform = `translateY(10rem)`;     
            }else{
                if(sceneInfo[3].objs.jMockup.style.opacity  != 1) { // jMockup 의 opacity 가 '0' 이면 jMockup의 애니메이션과 숫자 카운트를 실행
                    sceneInfo[3].objs.jMockup.style.opacity = `1`;
                    sceneInfo[3].objs.jMockup.style.transform = `translateY(-10rem)`;
                    // console.log(sceneInfo[1].objs.jCount01)
                    new countUp(sceneInfo[3].objs.jCount01,123153066); 
                    new countUp(sceneInfo[3].objs.jCount02,123153066);                
                }                    
            }
        break;
        }
    }
    // 현재 스크롤중인 섹션
    function scrollLoop() {
        // enterNewScene
        // 스크롤을 이용한 인터랙션 구현/ 스크롤 애니메이션 구현 4
        // enterNewScene 스크롤 오차 버그 수정
        enterNewScene = false;
        //초기화
        prevScrollHeight = 0;
        if(window.pageYOffset < sceneInfo[0].scrollHeight){
            btnTop.style.opacity = '0';
        }else{
            btnTop.style.opacity = '1';
        }
        
        // console.log('scrollLoop : ' + currentScene);
        
        //스크롤을 이용한 인터랙션 구현 / 현재 활성시킬 씬 결정하기
        // 이전 스크롤 크기: currentScene가 0 이상일 때
        
        // 3. 이전 scene 높이
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        // 현재 scene 증가: 다음 scene으로 갈때
        if (yOffset > prevScrollHeight + (sceneInfo[currentScene].scrollHeight)) {
            // 새로운 scene
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute("id", `show-scene-${currentScene}`);
        }
        // 현재 scene 감소: 이전 scene으로 갈때
        if (yOffset < prevScrollHeight) {
            // 새로운 scene
            enterNewScene = true;
            // 0에서 이전으로 갈때
            if (currentScene === 0) {
                return; //모바일 브라우저 마이너스 방지
            }
            currentScene--;
            document.body.setAttribute("id", `show-scene-${currentScene}`);
        }

        // scene이 바뀌는 순간만 playAnimation을 실행하지 않고 종료
        if (enterNewScene) {
            return;
        }
        // console.log(sceneInfo[currentScene].objs.elemCb)
        // sceneInfo[currentScene].objs.elemCb.addEventListener('click',console.log('ok'));

        playAnimation();
    }

    
    window.addEventListener('load',()=>{
        // 마무리 작업 / 버그 수정 1
        document.body.classList.remove('before-load');
        setLayout();
        btnTop.style.opacity = '0';
        btnTop.addEventListener('click',function(e){
            e.preventDefault();
            window.scrollTo(0,0)
        })
        window.addEventListener("scroll", () => {
          yOffset = window.pageYOffset;
        //   console.log('event() scroll :');
          scrollLoop();
        });

        window.addEventListener('resize', () => {
          if (window.innerWidth > 400) {
            setLayout();
          }
        });

        window.addEventListener('orientationchange', () => {
			scrollTo(0, 0);
			setTimeout(() => {
				window.location.reload();
			}, 500);
  		});
  
      });
})();

