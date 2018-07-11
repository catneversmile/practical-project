	var d = 		{	username: "18665059339",
					nickname: "coolcats",
					sex: 0,
					province: 79025,
					city: 330200,
					district: 330000,
					birthday: "2003-12-03",
					password: "aaaaaaaa",
					captcha: "qwerer"	}
		d = JSON.stringify(d);

	$.post('http://59.111.103.100/api/register',d,function(e){
		console.log('e',e);
	})

var iconConfig = ['u-icon-male','u-icon-female'],
    starConfig = [{class:"z-follow", icon:"u-icon-ok", text:"已关注"},
									{class:"u-btn-primary", icon:"u-icon-plus", text:"关注"}],
    validator  = {
    	isPhone: function(value){
    		return /\d{11}/.test(value);
    	},
    	isEmpty: function(value){
    		var password = value.trim();
    		if(password.length>0){
    			return false;    			
    		}else{
    			return true;
    		}
    	},
    	isLength: function(value,min=8,max=16){
    		var reg = new RegExp('^\\S{'+min+','+max+'}$');
    		return reg.test(value);
    	},
    	isNickName:function(value,min=8,max=16){
    		var length = 0;
    		var valueArr = value.replace(/\s{1,}/,'')
    		for(let i=0;i<valueArr.length; i++){
    			if(valueArr.charCodeAt(i)>127 || valueArr.charCodeAt(i)==94){    				
    				length +=2;
    			}else{
    				length++;
    			}
    		}
    			return (length>=min && length<=max)
    	},
  }


var _ = {
	addClassName: function(item,name){
		let names = item.className + ' ' + name;
		item.setAttribute('class',names);			

	},
	delClassName: function(item,name){
		item.classList.remove(name);
	},
	hasClassName:function(node,Name){
		let nameArr = node.classList;
		for(let i=0; i<node.classList.length; i++){
			if(nameArr[i] === Name){return true;}			
		}		
		return false;
	},
	htmlToNode:function(html){
		var content = document.createElement('div');
		content.innerHTML = html;
		return content.firstChild;
	},
	$: function(id){
		return document.getElementById(id);
	},
	/*ajax options:{
	 * 	method:'GET'/'POST',
	 * 	url:
	 * 	success:f(data)
	 * 	fail:f(data)
	 *  data:{}   }
	 */
	ajax: function(options){
		let xmlhttp, data = options.data || {};
		let method = options.method || 'GET';
		if(window.XMLHttpRequest){
			xmlhttp = new XMLHttpRequest;
		}else{
			xmlhttp = new ActiveXobject('microsoft.XMLHTTP');
		}
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
				let data = JSON.parse(xmlhttp.responseText);
				options.success(data);
			}	
		}
		console.log(data)
		xmlhttp.open(method,'http://59.111.103.100'+options.url,true);
		xmlhttp.send(data);

	},
	emit:function(node,name,data){
		var event = document.createEvent("HTMLEvents");
		if(data){event.data = data;};		
		event.initEvent(name,true,true);
		node.dispatchEvent(event);				
	},
	on:function(node,name,fn){
		node.addEventListener(name,fn);
	},
	formatData:function(data){
	let turnedList = [];
	for(let i=0; i<data.length; i++){
		let dataitem = data[i];
		let newdata;
		if(dataitem[2]){
			newdata = _.formatData(dataitem[2]);
		}else{
			newdata = null;
		}
	turnedList[i] = {id:dataitem[0],name:dataitem[1],data:newdata}
	};
	return turnedList;	
	},
	createElement: function(tag,className,content){
		var node = document.createElement(tag);
		node.className=className;
		node.innerHTML = content || '';
		return node;
	}
};

/*APP:
 *	user:   	登录者信息
 *  Tabs:   	tab模块构造函数
 *  Search：		search组件构造函数
 *  Login:  	登录组件初始化构造
 *  nav:    	顶栏初始化函数
 *  Starlist: 明日之星初始化函数
 *  Emitter:  事件构造函数
 */ 
var App = {
};

// tabs 组件
(function(App) {	
	function Tabs(options){
		// _.extend(this,options)
		this.index = options.index || 0;
		//缓存节点
		this.nTab = options.container.getElementsByTagName('ul')[0];
		this.nTabs = this.nTab.children;

		//动态创建滑动块
		this.slideWrap =document.createElement('div');
		this.slide = document.createElement('div');
		this.slideWrap.setAttribute('class','tabs_track');
		this.slide.setAttribute('class','tabs_thumb');
		this.slideWrap.appendChild(this.slide);
		options.container.appendChild(this.slideWrap);

		this.init();
	}
	Tabs.prototype.init = function(){
		for(let i=0; i<this.nTabs.length; i++){
			this.nTabs[i].addEventListener('mouseenter',function(index){	
				this.hightlight(index);
			}.bind(this,i))
			this.nTabs[i].addEventListener('click',function(index){
				this.setCurrent(index);
			}.bind(this,i))
		}
		this.nTab.addEventListener('mouseleave',function(){
			this.hightlight(this.index);
		}.bind(this));
		this.setCurrent(this.index);
	}
	Tabs.prototype.hightlight = function(index){
		let tab = this.nTabs[index];
		let nThumb = this.slideWrap.getElementsByClassName('tabs_thumb')[0]
		nThumb.style.width = tab.offsetWidth + 'px';
		nThumb.style.left = tab.offsetLeft + 'px';
	}
	Tabs.prototype.setCurrent = function(index){
		this.nTabs[this.index].removeAttribute('class','z-active');
		this.index = index;
		this.nTabs[index].setAttribute('class','z-active');
		this.hightlight(index);
	}

	App.Tabs = Tabs;
})(window.App);

// search组件
(function(App){
	function Search(container){
		this.nForm = container;
		this.nKeyword = this.nForm.getElementsByTagName('input')[0];
		this.init();
	}
	Search.prototype.init = function(){
		this.nForm.addEventListener('submit',this.search.bind(this));

	}
	Search.prototype.search = function(event){
		if(this.nKeyword.value){
			event.prevenDefault();
			this.nKeyword.value = '';
		}
	}
	App.Search = Search;
})(window.App);

// 登录注册组件
(function(App){
	function Login(guest){
		this.nLogin    = guest.getElementsByTagName('button')[0] ;
		this.nRegister = guest.getElementsByTagName('button')[1];
		this.nLogout   = _.$('logout');
		this.nLogin.addEventListener('click', function(){
			this.modal = new App.LoginModal();
			this.modal.modal.addEventListener('ok',function(data){
				App.nav.initUserInfo(data);
				this.loginCallback && this.loginCallback(data);
			}.bind(this));

			this.modal.modal.addEventListener('register',function(){
				this.modal.hideModal();
				this.nRegister.click();
			}.bind(this));		
		}.bind(this));

		this.nRegister.addEventListener('click', function(){
			this.modal = new App.RegisterModal();
			_.on(this.modal.modal,'ok',function(){
				this.nLogin.click();
			}.bind(this));

		}.bind(this));
		// 登录退出
		this.nLogout.addEventListener('click', function(){
			_.ajax({
				url: '/api/logout',
				method:'POST',
				data:{},
				success:function(data){
					if(data.code ===200){
						window.location.href = '/index'
					}
				},
				fail: function(){}
			});
		}.bind(this));
	}
	App.Login = Login;
})(window.App);

/* banner轮播图
 * options:{
 * 	index:初始显示index值
 *	imagesUrl:[] 图片地址数组
 *  container: Banner模块放置DOM对象
 *  interval: 自动切换时间间隔
 * }
 *
 */
(function(App){
	function Slider(options){
		//初始化参数
		this.index     = options.index || 0;
		this.imagesUrl = options.imagesUrl;
		this.imgLength = options.imagesUrl.length;
		this.container = options.container;
		this.interval  = options.interval;
		// 创建节点
		this.slider = document.createElement('div');
		this.sliders = this.buildSlider();
		this.cursors = this.buildCursor();
		//初始化事件
		this.slider.addEventListener('mouseenter',this.stop.bind(this));
		this.slider.addEventListener('mouseleave',this.autoPlay.bind(this));
		this.container.appendChild(this.slider);
		this.slider.className = 'm-slider';
		// 初始化动作
		this.setCurrent();
		this.nav(this.index);
		this.autoPlay();
	}
	//创建图片节点
	Slider.prototype.buildSlider = function(){
		var ul = document.createElement('ul'),
				html = '';

		for(var i=0; i<this.imgLength; i++){
			html += '<li class="slider_img"><img src="'+this.imagesUrl[i]+'" alt=""></li>';
		}
		ul.innerHTML = html;
		this.slider.appendChild(ul);
		return ul.children;
	}
	// 创建指示器节点
	Slider.prototype.buildCursor = function(){
		var cursor = document.createElement('ul');
				html = '';
		cursor.className = 'm-cursor';
		for(var i=0; i<this.imgLength; i++){
			html += '<li data-index = "'+i+'"></li>';
		}
		cursor.innerHTML = html;
		this.slider.appendChild(cursor);
		cursor.addEventListener('click',function(enent){
			let index = parseInt(enent.target.getAttribute('data-index'));
			this.nav(index);
		}.bind(this));
		return cursor.children;
	}
	// 
	Slider.prototype.nav = function(index){
		if(this.index === index) return;
		this.last = this.index;
		this.index = index;
		this.fade();
		this.setCurrent();
	}
	// 下一页
	Slider.prototype.next = function(){
		let index = (this.index + 1) % this.imgLength;
		this.nav(index);
	}
	// 自动播放
	Slider.prototype.autoPlay = function(){
		this.timer = setInterval(function(){
			this.next();
		}.bind(this),this.interval)
	}
	// 停止自动切换
	Slider.prototype.stop = function(){
		clearInterval(this.timer);
	}
	// 显示/隐藏动画效果
	Slider.prototype.fade = function(){
		if(this.last !== undefined){
			this.sliders[this.last].style.opacity = 0;			
			_.delClassName(this.cursors[this.last],'z-active');
		}
		this.sliders[this.index].style.opacity = 1;		
	}
	//设置显示的对象
	Slider.prototype.setCurrent = function(){
		this.sliders[this.index].style.opacity = 1;
		_.addClassName(this.cursors[this.index],'z-active')
	}

	App.Slider =Slider;
})(window.App);

/* 顶栏初始化：构建tabs组件/search组件/登录注册 */
(function(App){
	var nav = {
		init: function(options){
			this.nName    = _.$('userdropdown').getElementsByClassName('user_name')[0];
			this.nGuest   = _.$('guest');
			this.nUser    = _.$('userdropdown');
			this.nSexIcon = _.$('sex');
			options = options || {};
			this.loginCallback = options.login;
			this.hdtab = new App.Tabs({
				container:_.$('hdtabs'),
				index:this.getTabIndex() || 0
			});
			this.search = new App.Search(_.$('search'));
			this.login  = new App.Login(this.nGuest);
			this.initLoginStatus();
		},
		getTabIndex: function(){},
		//获取登录信息
		initLoginStatus: function(){
			_.ajax({
				url:'/api/users?getloginuser',
				success:function(data){
				if(data.code === 200){
					this.initUserInfo(data.result);
					App.user = data.result;
					this.loginCallback && this.loginCallback(data.result);
				}			
				}.bind(this),
				fail:function(data){}
			});
		},
		initUserInfo: function(data){
			//设置用户姓名和性别Icon
			this.nName.innerText = data.nickname;
			_.addClassName(this.nSexIcon,iconConfig[data.sex]);

			// //隐藏登录 ，注册按钮，显示用户信息
			_.addClassName(this.nGuest,'hide');
			_.delClassName(this.nUser,'hide');
			// this.loginCallback && this.loginCallback(data)
		}
	}
  App.nav = nav;
})(window.App);

// 明日之星
(function(App){
	function StarList(container,data){
		this.listInfo = data;
		this.container = container;

		this.container.addEventListener('click',this.followHandler.bind(this));
		this.render(data);
	}
	// 渲染satarList列表
	StarList.prototype.render = function(data){
		var html = '';
		data.forEach(function(item){
			html += this.renderItem(item);
		}.bind(this))
		this.container.innerHTML = html;
	}
	// 渲染单个列表项目
	StarList.prototype.renderItem = function(item){
		var config = item.isFollow ? starConfig[0]:starConfig[1];
		var html = `<li class="m-card">
									<img src="./res/images/follower.png" alt="">
									<div class="card_info">
										<div>${item.nickname}</div>
										<div><span>作品 ${item.workCount}</span><span>粉丝 ${item.followCount}</span></div>
									</div>
									<button class="u-btn ${config.class}" data-userid = "${item.id}">
									<span class="u-icon ${config.icon}"></span>${config.text}	</button>
								</li>`;
		return html;
	}
	StarList.prototype.followHandler = function(event){
		var target = event.target;
		if(target.tagName ==='BUTTON'){
			var user = window.App.user;
			//未登录则跳转登录页面
			if(user.username === undefined){
				_.emit(this.container,'login');
				return;
			}
		  //已登录
		  var userId = parseInt(target.dataset.userid);
		  var	data;
		  //获取点击对象的信息
		  for(item in this.listInfo){
				if(this.listInfo[item].id === userId){
					data = this.listInfo[item];
					break;
				}
			};
			//根据类名判断按钮状态
			if(_.hasClassName(target,'z-follow')){
				this.unFollow(data, target.parentNode);
			}else{
				this.follow(data,target.parentNode);
			}			
		}

	}
	//发送关注请求并更新数据，重新渲染节点
	StarList.prototype.follow = function(followInfo,replaceNode){
		_.ajax({
			    url: "/api/users?follow",
			   data: {id:followInfo.id},
			 method: 'POST',
			success: function(data){
				if(data.code == 200){
					followInfo.isFollow = true;
					followInfo.followCount++;
					var html = this.renderItem(followInfo);
					var newNode = _.htmlToNode(html);
					replaceNode.parentNode.replaceChild(newNode,replaceNode);
				}
			}.bind(this),
		})
	}
	StarList.prototype.unFollow = function(followInfo,replaceNode){
		_.ajax({
			    url: "/api/users?follow",
			   data: {id:followInfo.id},
			 method: 'POST',
			success: function(data){
				if(data.code == 200){
					followInfo.isFollow = false;
					followInfo.followCount--;
					var html = this.renderItem(followInfo);
					var newNode = _.htmlToNode(html);
					replaceNode.parentNode.replaceChild(newNode,replaceNode);
				}
			}.bind(this),
		})	
	}
	App.StarList = StarList;
})(window.App);


// 基本弹出框
(function(App){
	function Modal(options){
		this.content = options.content || '这是一个提示消息';
		this.hdContent = options.hdContent || '提示消息：';
		this.modal = this.creatFrame();
		this.basicNode = this.creatNode();
		this.modal.appendChild(this.basicNode);
		this.initEventListener();
		this.showModal();
	}
	Modal.prototype.creatFrame = function(){
		var frame =`<div class="m-modal">
									<span class = 'u-icon-close'></span>

								</div>`; 
		return (_.htmlToNode(frame));
	};
	Modal.prototype.creatNode = function(){
		var node = `<div class="basic">
									<h4 class="head-content">${this.hdContent}</h4>
									<span class="content">${this.content}</span>
									<div class="btnWrap">
										<button class="u-btn u-btn-primary u-btn-ok">确定</button>
										<button class="u-btn  u-btn-quit">取消</button>
									</div>
		            </div>`;
		return (_.htmlToNode(node)); 
	}
	Modal.prototype.initEventListener=function(){
		this.modal.getElementsByClassName('u-icon-close')[0]
		.addEventListener('click',function(){this.hideModal()}.bind(this));
		this.modal.addEventListener('click',function(e){
			var target = e.target;
			if(e.target.classList.contains('u-btn-ok')){
				_.emit(e.target,'ok');
			}else if(e.target.classList.contains('u-btn-quit')){
				_.emit(e.target,'quit');
				this.hideModal();
			}
		}.bind(this))
	}
	Modal.prototype.showModal = function(){
		document.getElementsByTagName('body')[0].appendChild(this.modal);
	};
	Modal.prototype.hideModal = function(){		
		document.getElementsByTagName('body')[0].removeChild(this.modal);
	}
	App.Modal = Modal;
})(window.App);

//登录弹出框
(function(App){
	// var validator = App.validator;
	var html =`<div>
							<div class="modal_head"><strong>欢迎回来</strong><span>还没有帐号？<a class="u-link" id="goregister" href="">立即注册</a></span></div>
							<form action="" class="m-form m-form-1" id="loginform">
								<div class="u-formitem"><input id="username" type="text" placeholder="手机号"></div>
								<div class="u-formitem"><input id="password" type="password" placeholder="密码"></div>
								<div class="u-formitem u-formitem-2">
									<label for="remember" class="u-checkbox u-checkbox-remember">
										<input type="checkbox" id="remember">
										<i class="u-icon-checkbox"></i>
										<i class="u-icon u-icon-checkboxchecked"></i>
										<span>保持登录</span>
									</label>
									<span class="forget">忘记密码？</span>
								</div>
								<div class="u-error hide"><span class="u-icon u-icon-error"></span><span id="errormsg">贴帐号或密码不正确，请重新输入</span></div>
								<button class="u-btn u-btn-primary u-btn-block" type="submit">登&nbsp;&nbsp;录</button>
							</form>		
						</div>`;
	function LoginModal(){
		this.html = _.htmlToNode(html);
		App.Modal.call(this,{});
		_.addClassName(this.modal,'m-modal-2');
		this.modal.replaceChild(this.html,this.basicNode);
		this.nForm     = document.getElementById('loginform');
		this.nUsername = document.getElementById('username');
		this.nPassword = document.getElementById('password');
		this.nRemember = document.getElementById('remember');
		this.nError    = document.getElementById('errormsg');
		this.setLoginEvent();
		// return this.modal;
	};
	LoginModal.prototype = Object.create(App.Modal.prototype);
	LoginModal.prototype.setLoginEvent = function(){
		//绑定注册事件
		_.$('goregister').addEventListener('click',function(e){			
			e.preventDefault();
			_.emit(this.modal,'register');
		}.bind(this));
		//绑定提交事件
		this.modal.getElementsByTagName('button')[0].addEventListener('click',function(e){
			e.preventDefault();
			this.submit(e);
		}.bind(this));
		//点击input表单时取消错误信息的展示
		this.nForm.addEventListener('click',function(e){
			if(e.target.tagName === 'INPUT' || !_.hasClassName(this.nError.parentNode,'hide')){
				this.nUsername.style.boxShadow = 'none';
				this.nPassword.style.boxShadow = 'none';
				this.modal.style.boxShadow = 'none';
				_.addClassName(this.nError.parentNode,'hide');
			}
		}.bind(this))
	};

	LoginModal.prototype.check = function(){
		var isValid = true,
				flag = true;
		//验证用户名
		flag = flag && !validator.isEmpty(this.nUsername.value);
		flag = flag && validator.isPhone(this.nUsername.value,true);
		!flag && this.showError(this.nUsername,true);
		isValid = isValid && flag;

		//验证密码
		flag = true;
		flag = flag && !validator.isEmpty(this.nPassword.value);
		!flag && this.showError(this.nPassword,true);
		isValid = isValid && flag;

		return isValid;
	};

	//向服务器发送登录验证信息，验证成功则触发ok事件，否则展示错误信息
	LoginModal.prototype.submit = function(event){
		if(this.check()){
			var data = {
				username: this.nUsername.value.trim(),
				password: hex_md5(this.nPassword.value),
				remember: !!this.nRemember.checked
			};
			_.ajax({
				    url: '/api/login',
				 method: 'POST',
				   data: data,
				success: function(data){
					if(data.code === 200){
						_.emit(this.html,'ok',data.result);
						this.hideModal();
					}else{
						switch(data.code){
							case 400:
								this.nError.innerHTML = '密码错误，请重新输入';
								_.delClassName(this.nError.parentNode,'hide');	
								break;
							case 404:
								this.nError.innerHTML = '用户不存在，请确认用户名正确';
								_.delClassName(this.nError.parentNode,'hide');	
								break;
						}
						this.showError(this.modal,true);
					}
				}.bind(this),
				fail: function(){}
			})
		}
	};

	//展示错误信息
	LoginModal.prototype.showError = function(node){
		node.style.boxShadow = '0px 0px 3px 1px #f07a70';			
	};

	App.LoginModal = LoginModal;
})(window.App);

//注册页面模块 
(function(App){
	var html = `<div>
		<div class="modal_head modal_head_1"><img src="./res/logo.png" alt=""></div>
		<form action="" class="m-form" id="loginform">
			<div class="u-formitem u-formitem-1" for=""><label>手机号<input id="username" type="text" placeholder="请输入手机号码"></label></div>
			<div class="u-formitem u-formitem-1"><label><input id="nickname" type="text" placeholder="昵称">昵称</label></div>
			<div class="u-formitem u-formitem-1"><label><input id="password" type="password" autocomplete="new-password" placeholder="长度6-16个字符，不包含空格">密码</label></div>
			<div class="u-formitem u-formitem-1"><label><input id="comfirmPassword" type="password" autocomplete="new-password" >确认密码</label></div>
			<div class="u-formitem u-formitem-1">性别
				<label class="u-radio">
					<input id="male" name="sex"  type="radio" value="0" checked>
					<i class="u-icon-radio"></i>
					<i class="u-icon-radiochecked"></i>
					<span>少男</span>
				</label>
				<label class="u-radio">
					<input id="female" name="sex" type="radio" value="1">
					<i class="u-icon-radio"></i>
					<i class="u-icon-radiochecked"></i>
					<span>少女</span>
				</label>			
			</div>
			<div class="u-formitem u-formitem-1">
				<label>生日</label>
				<div class="formitem_ct">
					<div class="m-cascadeselect" id="birthday">
						<div class="m-select">
							<div class="select_hd">
								<span class="select_val">年</span>
								<span class="u-icon-dropdown"></span>
							</div>
							<ul class="select_opt hide">
								<li data-index="0" class="z-select">北京</li>	
								<li data-index="1">天津</li>	
							</ul>
						</div><div class="m-select">
							<div class="select_hd">
								<span class="select_val">月</span>
								<span class="u-icon-dropdown"></span>
							</div>
						</div><div class="m-select">
							<div class="select_hd">
								<span class="select_val">日</span>
								<span class="u-icon-dropdown"></span>
							</div>
						</div>			
					</div>
				</div>
			</div>
			<div class="u-formitem u-formitem-1">
				<label>所在地</label>
				<div class="formitem_ct">
					<div class="m-cascadeselect" id="location">
					</div>
				</div>
			</div>
			<div class="u-formitem u-formitem-1"><label>验证码
				<div>					
					<input id="captcha" type="text" class="u-apt">
					<img id="captchimg" src="http://59.111.103.100/captcha" sytle="width:95px; height: 38px;">
				</label></div>
			</div>
			<div class="u-formitem u-formitem-1">
				<label for="agreement" class="u-checkbox u-checkbox-agreement">
					<input type="checkbox" id="agreement" >
					<i class="u-icon-checkbox"></i>
					<i class="u-icon u-icon-checkboxchecked"></i>
					<span>我已阅读并同意相关条款</span>
				</label>
			</div>
			<div class="u-error hide"><span class="u-icon u-icon-error"></span><span id="errormsg">请确认输入信息</span></div>
			<button class="u-btn u-btn-primary u-btn-block" type="submit">登&nbsp;&nbsp;录</button>
		</form>`;
	function RegisterModal(){
		this.html = _.htmlToNode(html);
		App.Modal.call(this,{});
		_.addClassName(this.modal,'m-modal-1');
		this.modal.replaceChild(this.html,this.basicNode);
		this.nForm = document.getElementById('loginform');
		this.nUsername = document.getElementById('username');
		this.nNickname = document.getElementById('nickname');
		this.nPassword = document.getElementById('password');
		this.nComfirmPassword = document.getElementById('comfirmPassword');
		this.nBirthday = document.getElementById('brithday');
		this.nLocation = document.getElementById('location');
		this.nAgreement= document.getElementById('agreement');
		this.nError    = document.getElementById('errormsg');
		this.nCaptcha  = document.getElementById('captcha');
		this.nCaptchimg  = document.getElementById('captchimg') 
		this.male = document.getElementById('male');
		this.female = document.getElementById('female'); 
		this.initSelect();
		this.initRegisterEvent();
	};
	RegisterModal.prototype = Object.create(App.Modal.prototype);
	RegisterModal.prototype.initRegisterEvent = function(){
		this.modal.getElementsByTagName('button')[0]
		.addEventListener('click',function(e){
			e.preventDefault();
			this.submit();
		}.bind(this));

		this.nForm.addEventListener('click',function(e){
			if(e.target.tagName === 'INPUT' && !_.hasClassName(this.nError.parentNode,'hide')){
				var formItems = this.modal.getElementsByTagName('INPUT');
				for(let i=0; i<formItems.length; i++){
					formItems[i].style.boxShadow = '0px 0px 0px 0px #fff';
					this.modal.style.boxShadow = '0px 0px 0px 0px #fff';
				}
				_.addClassName(this.nError.parentNode,'hide');
			}
		}.bind(this));

		this.nCaptchimg.addEventListener('click',function(){
		this.nCaptchimg.src = 'http://59.111.103.100/captcha?t='+ +new Date();
		}.bind(this));
	};
	RegisterModal.prototype.initSelect = function(){
		this.locationSelect = new App.CascadeSelect({container:this.nLocation})

	};
	RegisterModal.prototype.resetCaptcha = function(){};
	RegisterModal.prototype.submit = function(){
		var sex = (function(){
			if(this.male.checked){
				return parseInt(this.male.value);
			}else{
				return parseInt(this.female.value);
			}
		})();
		if(this.check()){
			var data = {
				username: this.nUsername.value.trim(),
				nickname: this.nNickname.value.trim(),
				password: hex_md5(this.nPassword.value),
				sex: sex,
				captcha: this.nCaptcha.value.trim(),
			}		

			// this.birthday = this.birthdaySelect.getValue().join('-');
			this.birthday = '2018-2-2';
			this.location = this.locationSelect.getValue();
			data.province = this.location[0];
			data.city = this.location[1];
			data.district = this.location[2];
			data.birthday = this.birthday;

			_.ajax({
				url: '/api/register',
				method: 'POST',
				data: data,
				success: function(data){
					if(data.code === 200){
						_.on(document,'ok',function(){alert("ok")})
						_.emit(this.modal,'ok');
						this.hideModal();
					}else{
						this.nError.innerText = data.msg;
						this.showError(this.modal,true);
					}
				}.bind(this),
				fail:function(){}
			});
		}
	};
	RegisterModal.prototype.check = function(){
		var isValid = true,
				errormsg = '';
		var checkList = [
			[this.nUsername, ['required','phone']],
			[this.nNickname, ['required','nickname']],
			[this.nPassword, ['required','length']],
			[this.nComfirmPassword,['required','length']],
			[this.nCaptcha, ['required']]
		]

		isValid = this.checkRules(checkList);
		if(!isValid){
			errormsg = '输入有误';
			this.nError.innerText = errormsg;
		}
			return isValid;
	};
	RegisterModal.prototype.checkRules = function(checkRules){
		for(let i=0; i<checkRules.length; i++){
			var	checkItem = checkRules[i][0],
					rules = checkRules[i][1],
					flag = true;
			for(let j=0; j<rules.length; j++){
				let key = rules[j];
				switch(key){
					case 'nickname':
						flag = validator.isNickName(checkItem.value);
						break;
					case 'length':
						flag = validator.isLength(checkItem.value,6,16);
						break;
					case 'required':
						flag = !validator.isEmpty(checkItem.value);
						break;
					case 'phone':
						flag = validator.isPhone(checkItem.value);
						break;
				}
				if(!flag){
					this.showError(checkItem);
					break}
			}
		}
		return flag;
	}
	RegisterModal.prototype.showError = function(node){
		node.style.boxShadow = '0px 0px 2px 1px #f07a70';
		_.delClassName(this.nError.parentNode,'hide');	
	}
	App.RegisterModal =RegisterModal;
})(window.App);

// 日期选择器组件

(function(App){
	var template = `<div class="m-select"></div>`;
	var	option = `<ul class="select_opt hide"></ul>`;
	var		head = `<div class="select_hd">
								<span class="select_val">北京</span>
								<span class="u-icon-dropdown"></span>
							</div>`;

	function Select(options){
		this.options;
		this.container = options.container;
		this.body = _.htmlToNode(template);
		this.nOption = _.htmlToNode(option);
		this.nHead = _.htmlToNode(head);
		this.selectedIndex;
		this.nValue =this.nHead.getElementsByClassName('select_val')[0];
		this.init();
		
	}
	// _.extend(Select.prototype,App.emitter);
	Select.prototype.init= function(){
		// this.render(ADDRESS_CODES);
		this.body.appendChild(this.nHead);
		this.body.appendChild(this.nOption);
		this.container.appendChild(this.body);
		this.initEvent();
	};

	// 初始化事件绑定
	Select.prototype.initEvent= function(){
		this.body.addEventListener('click',this.clickHandler.bind(this));
		document.addEventListener('click',this.close.bind(this));
	};

	// ul列表渲染
	Select.prototype.render= function(data,defaultIndex){
		var optionsHTML = '';
		var formatData = [];
		// 格式化数据
		for(let i=0; i<data.length; i++){
			let item = data[i];
			formatData[i] = {id:item[0],name:item[1],data:item[2]}
		}
		data = formatData;
		//渲染节点	
		for(var i=0; i<data.length; i++){	
			optionsHTML += `<li data-index=${i}>${data[i].name}</li>`;
		}

		this.nOption.innerHTML = optionsHTML;
		this.nOptions = this.nOption.children;
		this.options = data;
		this.selectedIndex = undefined;
		this.setSelect(defaultIndex || 0);
	};

	// 点击事件回调函数
	Select.prototype.clickHandler= function(event){
		// 判断点击对象，选择框点击则弹出下拉菜单，选择项点击则设置为选择对象
		event.stopPropagation()
		if(event.target.tagName ==="SPAN" || event.target.tagName === "DIV"){
			this.toggle();
		}else{
			this.setSelect(event.target.dataset.index)
			this.close();
		}

	};
	Select.prototype.open= function(){_.delClassName(this.nOption,'hide');};
	Select.prototype.close= function(){_.addClassName(this.nOption,'hide')};
	Select.prototype.toggle= function(){_.hasClassName(this.nOption,'hide')? this.open() : this.close()};
	Select.prototype.getValue= function(){	
		return this.options[this.selectedIndex].data;
	};
	Select.prototype.setSelect= function(index){
		if(this.selectedIndex !== undefined){
			_.delClassName(this.nOptions[this.selectedIndex],'z-select');
		}
		this.selectedIndex = index;
		this.nValue.innerHTML = this.options[this.selectedIndex].name;
		_.addClassName(this.nOptions[this.selectedIndex],'z-select')
		_.emit(this.nOptions[this.selectedIndex],'select',this.getValue());
	};
	App.Select = Select;
})(window.App);
// new App.Select();

// 地区级联选择器实现
(function(App){
	function CascadeSelect(options){
		this.container = options.container;
		this.data = ADDRESS_CODES;
		this.selectList = [];
		this.init();

	}
	CascadeSelect.prototype.init = function(){
		for(let i=0; i<3; i++){
			let select = new App.Select({
				container:this.container
			});
			_.on(select.body,'select',function(e){
				this.onChange(i,e.data);
			}.bind(this));
			this.selectList[i] = select;
		}
		this.selectList[0].render(this.data);
	};
	CascadeSelect.prototype.getValue = function(){
		let value = [];
		for(let i=0; i<this.selectList.length; i++){
			value[i] = this.selectList[i].options[this.selectList[i].selectedIndex].id;
		}
			return value;

	};
	//响应select事件，渲染下一个Select数据
	CascadeSelect.prototype.onChange = function(index,data){
		var next = index+1;
		if(next ===this.selectList.length) return;
		this.selectList[next].render(data);
	};
	//获取第n个Select数据
	CascadeSelect.prototype.getList = function(n){
		// this.selectList[n].render(this.selectList)
	};
	App.CascadeSelect = CascadeSelect;
})(window.App);


// 首页初始化

(function(App){
	var page = {
		init:function(){
			this.initNav();
			this.initStarList();
			this.slider = new App.Slider({
				index:1, 
				imagesUrl:['./res/images/banner0.jpg','./res/images/banner1.jpg','./res/images/banner2.jpg','./res/images/banner3.jpg'],
				container:document.getElementsByClassName('g-banner')[0],
				interval:2000							
			});	
			this.initSubTabs = new App.Tabs({
					container:_.$('subtabs'),
					index: 0
				});
		},
		initNav:function(){
			App.nav.init({
				login:function(data){
					if(!App.user.username){
						App.user = data;
						this.initStarList();
					}
				}.bind(this)
			});
		},
		initStarList:function(){
			_.ajax({
				url:'/api/users?getstarlist',
				success:function(data){
					if(data.code ===200){
						if(!this.starlist){
							this.starlist = new App.StarList(_.$('starlist'),data.result);
							_.on(this.starlist.container,'login',function(){
								_.$('login').click();
								// this.nav.showLogin();
							}.bind(this));
						}else{
							this.starlist.render(data.result);
						}
					}
				}.bind(this),
				fail:function(){}
			});
		}
	}
	App.page = page;

})(window.App);
