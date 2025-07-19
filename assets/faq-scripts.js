jQuery(document).ready(function(){
  jQuery('a.sppb-btn.cta_btn').click(function(e){
    e.preventDefault();
    var targetId = jQuery(this).attr('href');
    jQuery('html, body').animate({
      scrollTop: $(targetId).offset().top
    }, 1000);
  });

  $('img.sppb-img-responsive').each(function() {
    let fullSrc = $(this).attr('src');
    let shortSrc = fullSrc.replace(/^.*\/images/, 'assets');
    $(this).attr('src', shortSrc);
  });

  jQuery('.accordion_block .sppb-panel.sppb-panel-custom').first().addClass('active_tab');
  jQuery('.accordion_block .sppb-panel.sppb-panel-custom').on('click', function() {
    if (jQuery(this).hasClass('active_tab')) {
      jQuery(this).toggleClass('active_tab');
    } else {
      jQuery('.accordion_block .sppb-panel.sppb-panel-custom').removeClass('active_tab');
      jQuery(this).addClass('active_tab');
    }
  });

  jQuery('*').each(function() {
    var currentFont = jQuery(this).css('font-family');
    if (currentFont.includes('hvdtrial_brandon_grotesqueRg')) {
      jQuery(this).css('font-family', 'HvDTrial Brandon Grotesque');
    }
  });

  jQuery(document).on('click', '.sppb-form-group.sppb-form-builder-field-3 .form-builder-radio-content .form-builder-radio-item:nth-child(1)', function(){
    jQuery(this).parents('.appointment_form').find('.sppb-form-group.sppb-form-builder-field-4').addClass('show_field');
  });
  jQuery(document).on('click', '.sppb-form-group.sppb-form-builder-field-3 .form-builder-radio-content .form-builder-radio-item:nth-child(2)', function(){
    jQuery(this).parents('.appointment_form').find('.sppb-form-group.sppb-form-builder-field-4').removeClass('show_field');
  });

  jQuery('.zcwf_row.partners_name').hide();
  jQuery(document).on('click', '#crmWebToEntityForm .field_row .zcwf_row.radio_field label[for="coupal"]', function(){
    jQuery(this).parents('.field_row').find('.zcwf_row.partners_name').show();
  });
  jQuery(document).on('click', '#crmWebToEntityForm .field_row .zcwf_row.radio_field label[for="individual"]', function(){
    jQuery(this).parents('.field_row').find('.zcwf_row.partners_name').hide();
  });
  jQuery(document).on('click', '#crmWebToEntityForm .field_row .zcwf_row.radio_field label[for="fcoupal"]', function(){
    jQuery(this).parents('.field_row').find('.zcwf_row.partners_name').show();
  });
  jQuery(document).on('click', '#crmWebToEntityForm .field_row .zcwf_row.radio_field label[for="findividual"]', function(){
    jQuery(this).parents('.field_row').find('.zcwf_row.partners_name').hide();
  });
});
