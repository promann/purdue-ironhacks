import React from "react";

export default class HackTypeAndIdSelector extends React.Component {
    render () {
        
        let hackTypeOptions = ["All"]
          , hackIdOptions = ["All"]
          ;
        console.log(this.props.users)
        this.props.users.forEach(user => {
            console.log("····")
            console.log(user.profile)
            console.log("····")
            if (!hackTypeOptions.includes(user.profile.hack_type)) {
                hackTypeOptions.push(user.profile.hack_type);
            }
            if (!hackIdOptions.includes(+user.profile.hack_id)) {
                hackIdOptions.push(+user.profile.hack_id);
            }
        });
        console.log(_pageData.hackTypes)
        console.log(hackTypeOptions)
        hackTypeOptions = hackTypeOptions.map((c, i) => {
            console.log("--")
        console.log(c)
        console.log(i)
        console.log(_pageData.hackTypes[c])
        console.log(c === "All" ? c : _pageData.hackTypes[c].label)
        console.log("--")
            return <option key={i} value={c}>{c === "All" ? c : _pageData.hackTypes[c].label}</option>
        });

        hackIdOptions = hackIdOptions.map((c, i) => {
            return <option key={i} value={c}>{c}</option>
        });

        const hackTypeSelect = <select defaultValue="All" name="hackType">
            {hackTypeOptions}
        </select>;

        const hackIdSelect = <select defaultValue="All" name="hackId">
            {hackIdOptions}
        </select>;

        const exportTypeSelect = this.props.show_export_type ? <select name="exportType">
            <option value="users">User Details</option>
            <option value="forum_details">Forum Details</option>
        </select> : null;

        return <span>
            {hackTypeSelect}
            {hackIdSelect}
            {exportTypeSelect}
        </span>;
    }
}
