const USER_ICON_PATH = 'img/user-icon.svg';
const API_ORIGIN = 'http://127.0.0.1:3000'

const membersSidebar = document.querySelector('#members-sidebar');

const addMemberForm = document.querySelector('#add-member-form');
const editMemberForm = document.querySelector('#edit-member-form');

const confirmationOverlay = document.querySelector('#confirmation-overlay');
const confirmDeleteButton = document.querySelector('#confirm-delete-button');
const cancelDeleteButton = document.querySelector('#cancel-delete-button');

const cancelEditButton = document.querySelector('#cancel-edit-button');

const addMemberContainer = document.querySelector('#add-member-container');
const editMemberContainer = document.querySelector('#edit-member-container');

const userSaveSuccessToast = document.querySelector('#user-save-success-toast');
const userSaveFailedToast = document.querySelector('#user-save-failed-toast');
const userUpdateSuccessToast = document.querySelector('#user-update-success-toast');
const userUpdateFailedToast = document.querySelector('#user-update-failed-toast');

const userIdDataAttribute = 'data-user-id';

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
    userIdParagraph.textContent = `ID: ${userId.split('-')[0]}`;
    memberCardContainer.append(userIdParagraph);

    const userEmailParagraph = document.createElement('p');
    userEmailParagraph.textContent = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sportclub.com`
    memberCardContainer.append(userEmailParagraph);

    const editButton = document.createElement('button');
    editButton.setAttribute(userIdDataAttribute, userId);
    editButton.classList.add('edit-member-button');
    editButton.textContent = 'Edit';
    memberCardContainer.append(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute(userIdDataAttribute, userId);
    deleteButton.classList.add('delete-member-button');
    deleteButton.textContent = 'Delete';
    memberCardContainer.append(deleteButton);

    return memberCardContainer;
}

function loadMembers() {
    const getUsersUrl = `${API_ORIGIN}/users`;
    axios.get(getUsersUrl)
        .then(function (response) {
            membersSidebar.innerHTML = '';
            response.data.forEach(member => {
                membersSidebar.append(createMemberCardHtml(member['firstName'], member['lastName'], member['id']));
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

window.onload = (event) => {
    loadMembers();
}

function deleteMember(userId) {
    const deleteUserUrl = `${API_ORIGIN}/users/${userId}`;
    return axios.delete(deleteUserUrl);
}

function showDeleteConfirmationDialogue(userId) {
    confirmDeleteButton.setAttribute(userIdDataAttribute, userId);
    confirmationOverlay.style.display = 'block';
}

function closeDeleteConfirmationDialogue() {
    confirmDeleteButton.removeAttribute(userIdDataAttribute);
    confirmationOverlay.style.display = 'none';
}

function addMember(newMember) {
    const postUserUrl = `${API_ORIGIN}/users`;
    return axios.post(postUserUrl, newMember);
}

function getMemberData(form) {
    const formData = new FormData(form);

    const newMember = {
        "firstName": formData.get('first-name'),
        "lastName": formData.get('last-name'),
        "address": {
            "streetAndNumber": formData.get('address'),
            "postalCode": formData.get('zip-code'),
            "city": formData.get('city'),
            "country": formData.get('country')
        },
        "sports": formData.getAll('practiced-sports'),
        "gender": formData.get('gender'),
        "age": formData.get('age'),
        "activity_class": formData.get('activity-class')
    };

    return newMember;
}

function fillUserEditForm(userId) {
    const getUserUrl = `${API_ORIGIN}/users/${userId}`;
    return axios.get(getUserUrl)
        .then(function (response) {
            const memberData = response.data;
            editMemberForm.reset();
            editMemberForm.elements['first-name'].value = memberData.firstName;
            editMemberForm.elements['last-name'].value = memberData.lastName;
            editMemberForm.elements['address'].value = memberData.address.streetAndNumber;
            editMemberForm.elements['zip-code'].value = memberData.address.postalCode;
            editMemberForm.elements['city'].value = memberData.address.city;
            editMemberForm.elements['country'].value = memberData.address.country;
            editMemberForm.elements['gender'].value = memberData.gender;
            editMemberForm.elements['age'].value = memberData.age;
            editMemberForm.elements['activity-class'].value = memberData.activity_class;
            memberData.sports.forEach(sport => {
                editMemberForm.elements[`edit-${sport}`].checked = true;
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function editMember(userId, newUserData) {
    const editUserUrl = `${API_ORIGIN}/users/${userId}`;
    newUserData['id'] = userId;
    return axios.put(editUserUrl, newUserData);
}

function popToastMessage(toast) {
    toast.style.display = 'block';
    toast.style.animation = 'none';
    toast.offsetHeight;
    toast.style.animation = null;
}

confirmDeleteButton.addEventListener('click', async function (event) {
    const userId = event.target.dataset.userId;
    await deleteMember(userId);
    loadMembers();
    closeDeleteConfirmationDialogue();
});

cancelDeleteButton.addEventListener('click', function (event) {
    closeDeleteConfirmationDialogue();
});

membersSidebar.addEventListener('click', async function (event) {
    if (event.target.nodeName === 'BUTTON') {
        const userId = event.target.dataset.userId;
        if (event.target.className == 'edit-member-button') {
            editMemberForm.removeAttribute(userIdDataAttribute);
            await fillUserEditForm(userId);
            editMemberForm.setAttribute(userIdDataAttribute, userId);
            if (window.matchMedia('(max-width: 1024px)').matches) {
                addMemberForm.reset();
                addMemberContainer.style.display = 'none';
                editMemberContainer.style.display = 'block';
            } else {
                addMemberContainer.style.display = 'block';
                editMemberContainer.style.display = 'block';
            }
        }
        if (event.target.className == 'delete-member-button') {
            showDeleteConfirmationDialogue(userId);
        }
    }
});

addMemberForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    await addMember(getMemberData(addMemberForm));
    loadMembers();
    popToastMessage(userSaveSuccessToast);
});

editMemberForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (event.target.hasAttribute(userIdDataAttribute)) {
        await editMember(event.target.dataset.userId, getMemberData(editMemberForm));
        editMemberForm.reset();
        editMemberForm.removeAttribute(userIdDataAttribute);
        loadMembers();
        popToastMessage(userUpdateSuccessToast);
        if (window.matchMedia('(max-width: 1024px)').matches) {
            editMemberContainer.style.display = 'none';
            addMemberContainer.style.display = 'block';
        }
    } else {
        popToastMessage(userUpdateFailedToast);
    }
});

cancelEditButton.addEventListener('click', function () {
    editMemberForm.removeAttribute(userIdDataAttribute);
    if (window.matchMedia('(max-width: 1024px)').matches) {
        editMemberContainer.style.display = 'none';
        addMemberContainer.style.display = 'block';
    }
});