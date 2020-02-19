$(function(){
    GetArticle()
    $('#callModal').click(function(){
      $('#modalArticle').modal('show')
      $('#title').val('')
      $('#desc').val('')
      $('#image').val('')
      $('#modalTitle').text('Add Record')
    })
   $('#save').click(function(){
     let article = {
       TITLE: $('#title').val(),
       DESCRIPTION: $('#desc').val(),
       IMAGE: $('#image').val()
     }
     if($('#modalTitle').text() == 'Add Record'){
      PostArticle(article)
     }else{
       UpdateArticle(article, $('#aID').val())
     }
     
   })
   let search = document.getElementById('search');
   search.onkeyup = function(){
     searchArticle($('#search').val())
   }
})
function PostArticle(article){
  $.ajax({
    url: 'http://110.74.194.124:15011/v1/api/articles',
    method: 'POST',
    data: JSON.stringify(article),
    headers: {
        'content-type': 'application/json'
    },
    success: function(res){
        Swal.fire(
            `${res.MESSAGE}`
          )
          GetArticle()
          $('#modalArticle').modal('hide')
    }, 
    error: function(er){
        console.log(er)
    }
})
}
function GetArticle(res){
        $.ajax({
            url:`http://110.74.194.124:15011/v1/api/articles?page=1&limit=15`,
            method:'GET',
            success: function(res){
                AppendToTable(res.DATA)
            },
            error: function(er){
    
            }
            
        })
    }
    
function DeleteArcticle(btn){
    let id=$(btn).parent().siblings('th').text()
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                url:`http://110.74.194.124:15011/v1/api/articles/${id}`,
                method:'Delete',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": '*/*'
                },
                success: function(res){
                    GetArticle()
                },
                error: function(er){
        
                }
                
            })
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    
}
function searchArticle(titles){
  $.ajax({
    url:`http://110.74.194.124:15011/v1/api/articles?title=${titles}&page=1&limit=15`,
    method:"GET",
    success: function(res){
      AppendToTable(res.DATA)
    },
    error: function(er){

    }
  })
}
function GoToDetail(id){
  window.location.href=`Detail.html?id=${id}`
}
function showModal(title,desc,image,id){
  $('#modalArticle').modal('show')
  $('#title').val(title)
  $('#desc').val(desc)
  $('#image').val(image)
  $('#aID').val(id)
  $('#modalTitle').text('Edit Record')
}
function UpdateArticle(article,id){
  $.ajax({
    url: 'http://110.74.194.124:15011/v1/api/articles/'+id,
    method: 'PUT',
    data: JSON.stringify(article),
    headers: {
        'content-type': 'application/json'
    },
    success: function(res){
        Swal.fire(
            `${res.MESSAGE}`
          )
          GetArticle()
          $('#modalArticle').modal('hide')
    }, 
    error: function(er){
        console.log(er)
    }
})
}
function AppendToTable(article){
    let content=""
    for (a of article){
        content+=
        `
        <tr>
        <th>${a.ID}</th>
        <td>${a.TITLE}</td>
        <td>${a.DESCRIPTION}</td>
        <td><img src=${a.IMAGE}></td>
        <td> 
        <button type="button" class="btn btn-danger"  id="aID" data-id=${a.ID} onclick=DeleteArcticle(this)>Delete</button>
        <button type="button" class="btn btn-success" onclick="GoToDetail(${a.ID})">View</button>
        <button type="button" class="btn btn-success" onclick="showModal('${a.TITLE}','${a.DESCRIPTION}','${a.IMAGE}','${a.ID}')">Edit</button>
        </td>
      </tr>
        `
    }
    $('tbody').html(content)
}
