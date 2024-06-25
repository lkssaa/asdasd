let lang = "ru", a;

function load(){
    if (document.querySelectorAll('.select-topic')!=null){
        document.querySelectorAll('.select-topic').forEach((item) => {item.parentNode.remove()})

    }
    if (document.querySelectorAll('.db')!=null){
        document.querySelectorAll('.db').forEach((item) => {item.parentNode.remove()})
        
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
        var li = document.createElement('li');
        var dbb = document.createElement('button');
        if(lang == 'ru') dbb.textContent = 'Редактировать';
        if(lang == 'en') dbb.textContent = 'Edit';
        
        dbb.className = 'db';
        li.appendChild(dbb);
        menu.appendChild(li);

        if (document.querySelector('.db')) {
            document.querySelector('.db').addEventListener('click', function() {
                fetch(`/gettopics?language=${lang}`)
                .then(response => {
                    if (!response.ok) {
                      throw new Error('Network response was not ok');
                    }
                    return response.json(); 
                  })
                 .then(data => {

                    var modal = document.createElement('div');
                    modal.classList.add('modal');
                    
                    var header = document.createElement('h2');
                    header.id = 'head';
                    header.textContent = 'Select theme to edit';
                    modal.appendChild(header);

                   
                    
                    var selectField = document.createElement('select');
                    selectField.id = 'answerSelector';
                    i=0;
                    while (data[i]!=undefined){
                        var option1 = document.createElement('option');
                        option1.value = data[i]['partit_id'];
                        option1.textContent = data[i]['partit_name'];
                        selectField.appendChild(option1);
                        i++;
                    }
                modal.appendChild(selectField);
                
                var optionRussian = document.createElement('button');
                optionRussian.className = 'a1';
                optionRussian.id = 'a11';
                optionRussian.textContent = 'Ок';
                optionRussian.addEventListener('click', function() {
                    a = document.querySelector('select').value;
                    document.querySelector('select').remove();
                    var inputField1 = document.createElement('textarea');
                    inputField1.id = 'b1';
                    fetch(`/getcontents?language=${lang}&id=${a}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                   .then(data => {
                    inputField1.value = data[0]['text_content'];
                    

                    modal.appendChild(inputField1);

                    var oba = document.createElement('button');
                    oba.textContent = 'Ок';
                    oba.addEventListener('click', function() {
                        fetch(`/edit?text=${document.getElementById('b1').value}&language=${lang}&id=${a}`)
                        closeModal();
                        load();
                    });
                    modal.appendChild(oba);
                });
                    this.remove();

                });
                modal.appendChild(optionRussian);

                var add = document.createElement('button');
                add.className = 'a2';
                add.textContent = 'Add';
                add.addEventListener('click', function() {
                    document.getElementById('a11').remove();
                    document.getElementById('answerSelector').remove();
                    document.getElementById('head').textContent = 'Print name'
                    var inp = document.createElement('textarea');
                    inp.id = 'b2';
                    modal.appendChild(inp);
                    var bu = document.createElement('button');
                    bu.textContent = 'Ок';

                    bu.addEventListener('click', function() {
                        fetch(`/add?name=${document.getElementById('b2').value}&language=${lang}`)
                        closeModal();
                        load();
                    });
                    modal.appendChild(bu);  
                    this.remove();
                });
                modal.appendChild(add);
                function closeModal() {
                    modal.remove();
                }
        
                document.body.appendChild(modal);
            })});
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
                    var im = document.createElement('img');


                    im.src = data[0]['pictures'];



                    document.querySelector('.content').appendChild(im);
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
                lang = "ru";
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
