<template>
	<div class = "app">
		<div class = "app__content"
		     :class = "{'app__content--is-show-modal': isShowAddTimerModal}">
			<h1>Таймеры</h1>
			<button class = "btn" @click.stop = "onOpenAddTimerModal">
				Add timer
			</button>
			<div class = "timers-container">
				<transition-group name = "default" tag = "div">
					<Timer v-for = "item in timers" :key = "item.id" :dateEnd = "new Date(item.dateEnd)" />
				</transition-group>
			</div>
		</div>
		<transition name = "fade">
			<div class = "add-timer-modal" v-if = "isShowAddTimerModal"
			     @click.stop = "isShowAddTimerModal = false">
				<div class = "add-timer-modal__container"
				     @click.stop = "">
					<div class = "add-timer-modal__main">
						<label class = "add-timer-modal__item">
							<div class = "add-timer-modal__title">Date</div>
							<input class = "add-timer-modal__input" type = "date" ref = "addTimerDate">
						</label>
						<label class = "add-timer-modal__item">
							<div class = "add-timer-modal__title">Time</div>
							<input class = "add-timer-modal__input" type = "time" ref = "addTimerTime">
						</label>
					</div>
					<div class = "add-timer-modal__controls">
						<button type = "button"
						        class = "btn--cancel"
						        @click.stop = "isShowAddTimerModal = false">
							Cancel
						</button>
						<button type = "button"
						        class = "btn--submit"
						        @click.stop = "onAddTimer">
							Submit
						</button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Timer from "./components/Timer.vue";
	
	export default {
		components: {
			Timer
		},
		data() {
			return {
				isShowAddTimerModal: false,
				interval: null,
				timers: null
			}
		},
		methods: {
			onOpenAddTimerModal() {
				const JSON_TIMERS = window.localStorage.getItem("timers");
				const TIMERS = JSON_TIMERS && JSON.parse(JSON_TIMERS);
				
				if (TIMERS.length < 3) {
					this.isShowAddTimerModal = true;
				} else {
					alert("Максимум 3 таймера");
				}
			},
			onAddTimer() {
				const JSON_TIMERS = window.localStorage.getItem("timers");
				const TIMERS = JSON_TIMERS && JSON.parse(JSON_TIMERS);
				
				if (!this.$refs.addTimerDate.value) {
					alert("Выберите дату");
					return;
				}
				if (!this.$refs.addTimerTime.value) {
					alert("Выберите время");
					return;
				}
				
				const DATE = this.$refs.addTimerDate.value.split("-");
				const TIME = this.$refs.addTimerTime.value.split(":");
				
				const TIMER_DATE = new Date(DATE[0], DATE[1] - 1, DATE[2], TIME[0], TIME[1]);
				const NEW_TIMER = [{
					id: +TIMER_DATE,
					dateEnd: TIMER_DATE
				}];
				
				window.localStorage.setItem(
					"timers",
					window.localStorage.getItem("timers") ?
						JSON.stringify(TIMERS.concat(NEW_TIMER)) :
						JSON.stringify(NEW_TIMER)
				);
				
				this.setTimersFromStorage();
				
				this.isShowAddTimerModal = false;
			},
			onDeleteTimer(timerId) {
				let timers = JSON.parse(window.localStorage.getItem("timers"));
				
				for (let i = 0; i < timers.length; i++) {
					if (timers[i].id === timerId) {
						timers.splice(i, 1);
						window.localStorage.setItem("timers", JSON.stringify(timers));
						this.setTimersFromStorage();
					}
				}
			},
			setTimersFromStorage() {
				let result = [];
				
				for (let i = 0, timers = window.localStorage.getItem("timers") && JSON.parse(window.localStorage.getItem("timers")); timers && i < timers.length; i++) {
					result.unshift(timers[i]);
				}
				
				this.timers = result.sort((a, b) => {
					return new Date(a.dateEnd) - (new Date(b.dateEnd));
				});
			}
		},
		mounted() {
			this.setTimersFromStorage();
			
			this.interval = setInterval(() => {
				this.$store.commit("setNow", new Date());
				this.$forceUpdate();
			}, 1000);
			
			this.$root.$on("delete-timer", this.onDeleteTimer);
		},
		beforeDestroy() {
			clearInterval(this.interval);
			this.$root.$off("delete-timer", this.onDeleteTimer);
		}
	}
</script>

<style lang = "scss">
	@import "./assets/styles/normalize.css";
	@import "./assets/styles/variables";
	
	body{
		font-size        : 18px;
		min-height       : 100vh;
		background-color : #E9E9E9;
	}
	
	h1, h2, h3{ margin : 0 0 $offset 0; }
	
	.app{
		&__content{
			text-align : center;
			transition : $transition;
			
			&--is-show-modal{
				filter : blur(3px);
			}
		}
	}
	
	.timers-container{
		margin-top : $offset;
	}
	
	.btn{
		color         : $white;
		border        : none;
		cursor        : pointer;
		margin        : $offset / 2;
		padding       : $offset / 2 $offset;
		transition    : $transition;
		font-weight   : 700;
		background    : transparentize($main_color, .25);
		border-radius : $border_radius;
		
		&--cancel{
			@extend .btn;
			background-color : transparentize($red, .25);
			
			&:hover{
				background-color : $red;
			}
		}
		
		&--submit{
			@extend .btn;
			background-color : transparentize($green, .25);
			
			&:hover{
				background-color : $green;
			}
		}
		
		&--disabled{
			cursor           : not-allowed;
			pointer-events   : none;
			background-color : gray;
		}
	}
	
	.add-timer-modal{
		top              : 0;
		left             : 0;
		color            : $white;
		width            : 100vw;
		height           : 100vh;
		display          : flex;
		position         : fixed;
		align-items      : center;
		justify-content  : center;
		background-color : transparentize($gray, .75);
		
		&__container{
			padding          : $offset * 2;
			border-radius    : $border_radius;
			background-color : $main_color;
		}
		
		&__main{
			display    : flex;
			padding    : $offset;
			text-align : center;
		}
		
		&__item{
			margin : $offset / 2 $offset;
		}
		
		&__controls{
			display         : flex;
			margin-top      : $offset / 2;
			justify-content : center;
		}
	}
	
	// Vue transition
	.default-enter-active, .default-leave-active, .fade-enter-active, .fade-leave-active{
		transition : $transition;
	}
	
	.default-enter, .default-leave-to{
		opacity   : 0;
		transform : translateY(50px);
	}
	
	.fade-enter, .fade-leave-to{
		opacity : 0;
	}
</style>
