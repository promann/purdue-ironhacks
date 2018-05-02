const PersonalScoreSchema = new Bloggify.db.Schema({
    semester: String,
    group_id: String,
    phase_id: Number,
    hack_id: Number,
    user_id: String,
    tech_error: Number,
    tech_req_met: Number,
    ana_qua: Number,
    ana_func: Number,
    ana_param_var: Number,
    data_vis_map_req: Number,
    data_vis_char_var: Number,
    data_vis_usa_points: Number,
    data_vis_nov_map_params: Number,
    data_vis_nov_map_data: Number,
    data_vis_nov_chart_params: Number,
    data_vis_nov_chart_data: Number,
    hacker_id : Number,
    hacker_position: Number
})
/*

Individual score structure
#    semester: String,
#    group_id: String,
#    phase_id: Number,
#    hack_id: Number,
#    user_id: String,
#    tech_score: Number,
#    func_score: Number,
#    info_vis_score: Number,
#    novel_score: Number,
#    hacker_id : Number,
#    hacker_position: Number
*/

PersonalScoreSchema.statics.record = data => {
    return PersonalScore(data).save()
}


const PersonalScore = module.exports = Bloggify.db.model("PersonalScore", PersonalScoreSchema)
