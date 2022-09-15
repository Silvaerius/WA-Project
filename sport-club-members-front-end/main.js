const USER_ICON_PATH = 'img/user-icon.svg';
const API_ORIGIN = 'http://127.0.0.1:3000'

const membersSidebar = document.querySelector('.members-sidebar');

function createMemberCardHtml(firstName, lastName, userId) {
    const memberCardContainer = document.createElement('div');
    memberCardContainer.classList.add('member-card');

    const userAvatar = document.createElement('img');
    userAvatar.setAttribute('src', USER_ICON_PATH);
    userAvatar.setAttribute('alt', 'user avatar');
    memberCardContainer.append(userAvatar);

    const userNameHeading = document.createElement('h3');
    userNameHeading.textContent = `${firstName} ${lastName}`;
    memberCardContainer.append(userNameHeading);

    const userIdParagraph = document.createElement('p');
    userIdParagraph.textContent = `ID: ${userId}`;
    memberCardContainer.append(userIdParagraph);

    const userEmailParagraph = document.createElement('p');
    userEmailParagraph.textContent = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sportclub.com`
    memberCardContainer.append(userEmailParagraph);

    const editButton = document.createElement('button');
    editButton.id = userId;
    editButton.classList.add('edit-member-button');
    editButton.textContent = 'Edit';
    memberCardContainer.append(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.id = userId;
    deleteButton.classList.add('delete-member-button');
    deleteButton.textContent = 'Delete';
    memberCardContainer.append(deleteButton);

    return memberCardContainer;
}

function loadMembers() {
    const getUsersUrl = API_ORIGIN + '/users';
    axios.get(getUsersUrl)
        .then(function (response) {
            response.data.forEach(member => {
                membersSidebar.append(createMemberCardHtml(member['firstName'], member['lastName'], member['id'].split('-')[0]));
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

window.onload = (event) => {
    loadMembers();
}

membersSidebar.addEventListener('click', function handleCardButtonClick(event) {
    if (event.target.nodeName === 'BUTTON') {
        const userId = event.target.id;
        if (event.target.className == 'edit-member-button') {
            // to do
        }
        if (event.target.className == 'delete-member-button') {
            //to do
        }
    }
});