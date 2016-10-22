export const skill = {
    name: 'skill',
    lambda: function(context) {
        return Promise.resolve(context);
    }
}

export const skillDelayed = {
    name: 'delayedSkill',
    lambda: function(context) {
        return new Promise(resolve => setTimeout(() => {
            context.done();
            resolve(context);
        }, 100));
    }
}
