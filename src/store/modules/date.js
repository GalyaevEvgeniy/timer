const state = {
	now: new Date()
};

const mutations = {
	setNow(state, value){
		state.now = value;
	}
};

export default {
	state,
	mutations
};