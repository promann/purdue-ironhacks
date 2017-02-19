import React from "react";

export default class HackTypeAndIdSelector extends React.Component {
    render () {
        let universityOptions = ["All"]
          , hackIdOptions = ["All"]
          ;

        this.props.users.forEach(user => {
            if (!universityOptions.includes(user.profile.university)) {
                universityOptions.push(user.profile.university);
            }
            if (!hackIdOptions.includes(+user.profile.hack_id)) {
                hackIdOptions.push(+user.profile.hack_id);
            }
        });

        universityOptions = universityOptions.map((c, i) => {
            return <option key={i} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
        });

        hackIdOptions = hackIdOptions.map((c, i) => {
            return <option key={i} value={c}>{c}</option>
        });

        const universitySelect = <select defaultValue="All" name="hackType">
            {universityOptions}
        </select>;

        const hackIdSelect = <select defaultValue="All" name="hackId">
            {hackIdOptions}
        </select>;

        return <span>
            {universitySelect}
            {hackIdSelect}
        </span>;
    }
}
