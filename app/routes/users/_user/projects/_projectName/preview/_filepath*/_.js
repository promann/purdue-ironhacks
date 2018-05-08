module.exports = ctx => {
	if(ctx.selected_project.username != ctx.selected_user.username){
    // The current user is NOT the owner of the project, now we need to check the treatment, if the hack_id == 0 the user shouldn't be here (treatment 1)
    // Checking if the current user is admin
    if(ctx.selected_user.role == 'admin'){
      //This is an admin, showing everithing
    }else{
      //Pulling data from the current user:
      Bloggify.services.exports.getUser(ctx.selected_project.id)
        .then(function(user){
          if(ctx.selected_user.hack_id != user[0].profile.hack_id){
            //This user should be here
            return "<p>:P</p>"
          }else{
            if(ctx.selected_user.hack_id == 0){
              //This user should be here
              return "<p>:P</p>"
            }else if(this.state.user.profile.hack_id == 1){
              return "<p>:P</p>"
            }else{
            	ctx.params.filepath = ctx.url.pathname.split("preview")[1].slice(1)
							Bloggify.services.projects.streamFile(ctx);
							return false
            }
          }
        })
      }
    }
    return false
  };