let lang = "rus";
function load(){
    if (document.querySelectorAll('.select-topic')!=null){
        document.querySelectorAll('.select-topic').forEach((item) => {item.parentNode.remove()})
    }
    fetch(`/gettopics?language=${lang}`)
    .then(response => {
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
       return response.json(); 
     })
    .then(data => {

       let i = 0;
       var menu = document.querySelector('.menu-list');
       while (data[i]!=undefined){
            var li = document.createElement('li');
            var b = document.createElement('a');
            b.textContent = data[i]['partit_name'];
            b.className = 'select-topic';
            b.id = data[i]['partit_id'];
            li.appendChild(b);
            menu.appendChild(li);
            i++;
       }
        document.querySelectorAll('.select-topic').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                fetch(`/getcontents?language=${lang}&id=${e.currentTarget.getAttribute('id')}`)
               .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
               .then(data => {
                    document.querySelector('.content').textContent = data[0]['text_content'];
                })
               .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            });
        });
    })
    
}

document.addEventListener('DOMContentLoaded', function() {
    
    var openModalButton = document.querySelector('.open-modal-button');
    
    if (openModalButton) {
        openModalButton.addEventListener('click', function() {
            var modal = document.createElement('div');
            modal.classList.add('modal');
            

            var header = document.createElement('h2');
            header.textContent = 'Выберите язык';
            modal.appendChild(header);
            

            var optionEnglish = document.createElement('button');
            optionEnglish.textContent = 'English';
            optionEnglish.addEventListener('click', function() {
                lang = "en";
                closeModal();
                load();
            });
            modal.appendChild(optionEnglish);
            

            var optionRussian = document.createElement('button');
            optionRussian.textContent = 'Русский';
            optionRussian.addEventListener('click', function() {
                lang = "rus";
                closeModal();
                load();
            });
            modal.appendChild(optionRussian);
            

            function closeModal() {
                modal.remove();
            }
            

            document.body.appendChild(modal);
        });
    }
    load();

    
});
