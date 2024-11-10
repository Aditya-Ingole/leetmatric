document.addEventListener("DOMContentLoaded", function () 
{
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    // return true or false based on a regex
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("username should not empty");
            return false;
        }

        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
        const isMatching = regex.test(username);

        if (!isMatching) {
            alert("Invalid Username!");
        }

        return isMatching;
    }

    //fetch details
    async function fetchUserDetails(username) {
        // const url =  https://leetcode-stats-api.herokuapp.com/${username};
        // const url = "https://leetcode.com/graphql/";

        try {
            searchButton.textContent = "searching...";
            searchButton.disabled = true;
            // statsContainer.classList.add("hide");

            // const response = await fetch(url);
            const proxyUrl = "https://cors-anywhere.herokuapp.com/";
            const targetUrl = "https://leetcode.com/graphql/";
            //   concate the both urls <https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/>

            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query:
                    "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { username: `${username}` }
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);

            if (!response.ok) {
                throw new Error("unable to fetch data...");
            }
            const parsedData = await response.json();
            console.log("the loaded data : ", parsedData);

            displayUserData(parsedData);
            // statsContainer.classList.remove("hide");


        } 

        catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } 
        
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }



    //adding the structured data to his circles.

    function updateProgress(solved,total,label,circle){
        const progresDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progresDegree}%`);
        label.textContent = `${solved}/${total}`;
    }






    // getting total, easy, medium and hard data from api 
    function displayUserData(parseData) {

        const totalQue = parseData.data.allQuestionsCount[0].count;
        console.log(totalQue);
        const totalEasyQue = parseData.data.allQuestionsCount[1].count;
        const totalMediumQue = parseData.data.allQuestionsCount[2].count;
        const totalHardQue = parseData.data.allQuestionsCount[3].count;


        const solvedTotalQue = parseData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        console.log(solvedTotalQue);
        const solvedTotalEasyQue = parseData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        // console.log(solvedTotalQue);
        const solvedTotalMediumQue = parseData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        // console.log(solvedTotalQue);
        const solvedTotalHardQue = parseData.data.matchedUser.submitStats.acSubmissionNum[3].count;
        // console.log(solvedTotalQue);
        

        updateProgress(solvedTotalEasyQue,totalEasyQue,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQue,totalMediumQue,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQue,totalHardQue,hardLabel,hardProgressCircle);


        const cardsData = [
            {label : "Overall Submission", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label : "Overall Easy Submission", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label : "Overall Medium Submission", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label : "Overall Hard Submission", value: parseData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}

        ];

        console.log("cards ka data : ", cardsData);
        
        cardStatsContainer.innerHTML = cardsData.map(
            data => {
                return `
                    <div class="card">
                    <h3>${data.label}</h3>
                    <p>${data.value}</p>
                    </div>
                `
            }
        ).join("")

        
    }



    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log(username);

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});

