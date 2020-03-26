<template>
	<div class = "timer">
		<div class = "timer__date-end">
			<h3 class = "timer__date-end__title">Выбранная дата и время</h3>
			<div class = "timer__date-end__value">{{ formattedDateEnd }}</div>
		</div>
		<div v-if = "+$store.state.date.now < +dateEnd"
		     class = "timer__countdown"
		     :class = "{'timer__countdown--is-soon': +$store.state.date.now + 1000 * 60 * 5 >= (+dateEnd)}">
			<span class = "timer__item" v-if = "days">{{days}}</span>
			<span class = "timer__item" v-if = "hours">{{hours}}</span>
			<span class = "timer__item" v-if = "minutes">{{minutes}}</span>
			<span class = "timer__item" v-if = "seconds">{{seconds}}</span>
		</div>
		<h2 v-else class = "timer__time-is-up">Таймер истёк</h2>
		<button class = "btn timer__delete" @click.stop = "$root.$emit('delete-timer', +dateEnd)"></button>
	</div>
</template>

<script>
	export default {
		props: {
			dateEnd: {
				type: Date,
				require: true
			}
		},
		computed: {
			formattedDateEnd() {
				let result = (this.dateEnd.getDate() < 10 ? `0` : ``) + `${this.dateEnd.getDate()}`;
				
				switch (this.dateEnd.getMonth()) {
					case 0: {
						result += " Января";
						break;
					}
					case 1: {
						result += " Февраля";
						break;
					}
					case 2: {
						result += " Марта";
						break;
					}
					case 3: {
						result += " Апреля";
						break;
					}
					case 4: {
						result += " Мая";
						break;
					}
					case 5: {
						result += " Июня";
						break;
					}
					case 6: {
						result += " Июля";
						break;
					}
					case 7: {
						result += " Авгеста";
						break;
					}
					case 8: {
						result += " Сентября";
						break;
					}
					case 9: {
						result += " Октября";
						break;
					}
					case 10: {
						result += " Ноября";
						break;
					}
					case 11: {
						result += " Декабря";
						break;
					}
				}
				
				result += ` ${this.dateEnd.getFullYear()}г. `;
				result += (this.dateEnd.getHours() < 10 ? `0` : ``) + `${this.dateEnd.getHours()}`;
				result += (this.dateEnd.getMinutes() < 10 ? `:0` : `:`) + `${this.dateEnd.getMinutes()}`;
				
				return result;
			},
			secondsDifferent() {
				return Math.floor((+this.dateEnd - (+this.$store.state.date.now)) / 1000);
			},
			days() {
				let result = "";
				const DIFFERENT = Math.floor(this.secondsDifferent / 60 / 60 / 24);
				
				if (DIFFERENT > 0) {
					switch (DIFFERENT) {
						case 1: {
						}
						case 21: {
						}
						case 31: {
							result = `${DIFFERENT} день`;
							break;
						}
						case 2: {
						}
						case 3: {
						}
						case 4: {
						}
						case 22: {
						}
						case 23: {
						}
						case 24: {
							result = `${DIFFERENT} дня`;
							break;
						}
						default: {
							result = `${DIFFERENT} дней`;
						}
					}
				}
				
				return result;
			},
			hoursDifferent() {
				return this.dateEnd.getHours() - this.$store.state.date.now.getHours();
			},
			hours() {
				let result = "";
				const DIFFERENT = this.hoursDifferent >= 0 ?
					this.hoursDifferent :
					24 + this.hoursDifferent;
				
				if (DIFFERENT !== 0) {
					switch (DIFFERENT) {
						case 1: {
						}
						case 21: {
							result = `${DIFFERENT} час`;
							break;
						}
						case 2: {
						}
						case 3: {
						}
						case 4: {
						}
						case 22: {
						}
						case 23: {
							result = `${DIFFERENT} часа`;
							break;
						}
						default: {
							result = `${DIFFERENT} часов`;
						}
					}
				}
				
				return result;
			},
			minutes() {
				let result = "";
				
				const DIFFERENT = Math.floor((Math.floor(this.secondsDifferent / 60)) % 60);
				if (DIFFERENT > 0) {
					switch (DIFFERENT) {
						case 1: {
							result = `${DIFFERENT} минута`;
							break;
						}
						case 2: {
						}
						case 3: {
						}
						case 4: {
							result = `${DIFFERENT} минуты`;
							break;
						}
						default: {
							result = `${DIFFERENT} минут`;
						}
					}
				}
				
				return result;
			},
			seconds() {
				let result = "";
				
				const DIFFERENT = Math.floor(this.secondsDifferent % 60);
				
				switch (DIFFERENT) {
					case 1: {
					}
					case 21: {
					}
					case 31: {
					}
					case 41: {
					}
					case 51: {
						result = `${DIFFERENT} секунда`;
						break;
					}
					case 2: {
					}
					case 3: {
					}
					case 4: {
						result = `${DIFFERENT} секунды`;
						break;
					}
					default: {
						result = `${DIFFERENT} секунд`;
					}
				}
				
				return result;
			}
		},
	}
</script>

<style scoped lang = "scss">
	@import "../assets/styles/variables";
	
	.timer{
		margin           : 0 auto $offset;
		padding          : $offset;
		position         : relative;
		max-width        : 500px;
		border-radius    : $border_radius;
		background-color : transparentize($main_color, .75);
		
		&__date-end{
			&__value{
				font-size       : 1.1em;
				text-decoration : underline;
				margin-bottom   : $offset * 1.5;
			}
		}
		
		&__countdown{
			&--is-soon{
				color     : $red;
				animation : pulse 1s linear infinite;
			}
			
			&:before{
				content      : "Осталось:";
				margin-right : $offset / 2;
			}
		}
		
		&__item{
			padding-right : $offset / 2;
			
			&:after{
				content : ",";
			}
			
			&:last-child{
				padding-right : 0;
				
				&:after{
					content : ".";
				}
			}
		}
		
		&__delete{
			$size : 24px;
			top                 : calc(50% - #{$size / 2});
			right               : $offset;
			width               : $size;
			height              : $size;
			margin              : 0;
			position            : absolute;
			transition          : $transition;
			background-size     : $size;
			background-color    : transparent;
			background-image    : url("/img/icons/trash.svg");
			background-repeat   : no-repeat;
			background-position : center;
			
			&:hover{ transform : scale(1.1) }
		}
		
		&__time-is-up{
			color : $red;
		}
	}
	
	@keyframes pulse{
		0%, 100%{ transform : scale(1); }
		50%{ transform : scale(1.15); }
	}
</style>
