var workEmail = "";  
var EmployeeID = "";  
var Division = "";  
var userDisplayName = "";  
var AccountName = "";  
var firstName="";
var lastname="";
var skillset="";
var webURL="";
var pictureLink="";
var department="";
var phone="";
$.ajax({  

    url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",  
    headers: { Accept: "application/json;odata=verbose" },  
    success: function (data) {  
        try {  
            //Get properties from user profile Json response  
            userDisplayName = data.d.DisplayName;  
            AccountName = data.d.AccountName;  
            var properties = data.d.UserProfileProperties.results;  
            for (var i = 0; i < properties.length; i++) {  
              var property = properties[i]; 
                if (property.Key == "WorkEmail") {  
                    workEmail = property.Value;  
                }  

                if (property.Key == "EmployeeID") {  
                    EmployeeID = property.Value;  
                }  
                if (property.Key == "Division") {  
                    Division = property.Value;  
                }  
              if (property.Key == "SPS-Skills") {  
                    skillset= property.Value;  
                }  
             if (property.Key == "WebSite") {  
                    webURL= property.Value;  
                }  
                 if (property.Key == "FirstName") {  
                    firstName= property.Value;  
                }  
              if (property.Key == "FirstName") {  
                    lastname= property.Value;  
                }  
                 if (property.Key == "Department") {  
                    department= property.Value;  
                }  
                if (property.Key == "WorkPhone") {  
                    phone= property.Value;  
                }  
                if (property.Key == "PictureURL") {  
                    pictureLink= property.Value;  
                }  			

            }  
            
            var picture='';
            var namedetails='';
            var skill='';
            var contatcDetails='';
            picture +="<img src= '"+ pictureLink +"' alt=''/>";  
            namedetails +="<div class='profile-head'>";
            namedetails +="<h5>"+userDisplayName +" </h5>";
            namedetails +="<h6>"+department +" </h6>";	
            namedetails +=' <p class="proile-rating">RANKINGS : <span>8/10</span></p> <ul class="nav nav-tabs" id="myTab" role="tablist"><li class="nav-item"><a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a></li><li class="nav-item"><a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Timeline</a></li></ul>';				
            namedetails +="</div>"; 
            
            skill +="<div class='profile-work'>";
            skill +='<p>WORK LINK</p><a href="">' +webURL+'</a><br/>';
            skill +='<p>SKILLS</p><a href="">' +skillset+'</a><br/>';
            skill +='</div>';
            
            contatcDetails +='<div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">';
            contatcDetails +='<div class="row"><div class="col-md-6"><label>User Id</label></div><div class="col-md-6"><p>'+AccountName+'</p></div></div>';
            contatcDetails +='<div class="row"><div class="col-md-6"><label>Name</label></div><div class="col-md-6"><p>'+userDisplayName+'</p></div></div>';
            contatcDetails +=' <div class="row"><div class="col-md-6"><label>Email</label></div><div class="col-md-6"><p>'+workEmail+'</p></div></div>';
            contatcDetails +='<div class="row"><div class="col-md-6"><label>Phone</label></div><div class="col-md-6"><p>'+phone+'</p></div></div>';
            contatcDetails +='<div class="row"><div class="col-md-6"><label>Profession</label></div><div class="col-md-6"><p>'+department+'</p></div></div>';
            
            contatcDetails +='</div>';
            
             $("#profImage").append(picture);
             $("#UserNamedetails").append(namedetails);
             $("#profileDetails").append(skill);
             $("#myTabContent").append(contatcDetails);
             
        } catch (err2) {  
            //alert(JSON.stringify(err2));  
        }  
    },  
    error: function (jQxhr, errorCode, errorThrown) {  
        alert(errorThrown);  
    }  
});  
