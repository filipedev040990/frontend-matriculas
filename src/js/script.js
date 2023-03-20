$(document).ready(() => {
    $('#myTab a').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

    $('#step2-tab').attr('href', '')
    $('#step3-tab').attr('href', '')
        
    $('#payment_card_holder_name').on('keyup', function () {
        const holderName = $(this).val().toUpperCase()
        $('#div_card_holder_name').html(holderName);
    })

    $('#payment_card_cvv').on('keyup', function () {
        const cvv = $(this).val()
        $('#div_card_cvv').html(cvv)
    })

    $('#payment_card_month').on('change', function () {
        const month = $(this).val()
        $('#div_card_month').html(month)
    })

    $('#payment_card_year').on('change', function () {
        const year = $(this).val()
        $('#div_card_year').html(year)
    })

    $('#payment_card_number').on('keyup', function () {
        const number = $(this).val()
        $('#div_card_number').html(number)
    })
})

async function advanceToStep2 () {
    const email = $('#email').val().trim()
    const name  = $('#name').val().trim()

    if(email === '' || name === '') {
        toastr.info('Preencha todos os campos.')
        return false
    }

    const url = 'http://localhost:3000/api/leads'
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ name, email})
    }
    
    const response = await fetch(url, options)

    if(response.status !== 204) {
        const responseMessage = await response.json()
        let toastrMessage = ''

        if(responseMessage.includes('Invalid param')) {
            toastrMessage = `Campo inválido: ${responseMessage.split(':')[1]}.`
        }

        if(responseMessage.includes('This email already exists')) {
            toastrMessage = 'Este email já existe em nosso sistema. Informe um outro email.'
        }

        toastr.error(toastrMessage);
        return false
    }

    if(response.status === 500) {
        toastr.error('Erro inesperado. Tente novamente em alguns instantes.');
        return false
    }

    $('#email').val('')
    $('#name').val('')

    $('#payment_person_email').val(email)
    $('#payment_person_email').attr('readonly', true)

    $('#step2-tab').attr('href', '#step2')
    $('#step2-tab').tab('show')
    
}


function setDocumentType (personType) {
    const documentType = personType === 'pf' ? 'CPF' : 'CNPJ'
    $('#document_label').html(documentType)
}

async function advanceToStep3() {
    const payment_person_type       = $('#payment_person_type').val().trim()
    const payment_person_name       = $('#payment_person_name').val().trim()
    const payment_person_email      = $('#payment_person_email').val().trim()
    const payment_person_document   = $('#payment_person_document').val().trim()
    const payment_person_phone      = $('#payment_person_phone').val().trim()
    const payment_person_cep        = $('#payment_person_cep').val().trim()
    const payment_person_street     = $('#payment_person_street').val().trim()
    const payment_person_number     = $('#payment_person_number').val()
    const payment_person_complement = $('#payment_person_complement').val().trim()
    const payment_person_district   = $('#payment_person_district').val().trim()
    const payment_person_state      = $('#payment_person_state').val()
    const payment_person_city       = $('#payment_person_city').val()
    const payment_card_holder_name  = $('#payment_card_holder_name').val().trim()
    const payment_card_number       = $('#payment_card_number').val()
    const payment_card_brand        = $('#payment_card_brand').val()
    const payment_card_month        = $('#payment_card_month').val()
    const payment_card_year         = $('#payment_card_year').val()
    const payment_card_cvv          = $('#payment_card_cvv').val()
    const payment_card_installments = $('#payment_card_installments').val().trim()

    if (
        payment_person_type       === '' ||  
        payment_person_name       === '' ||
        payment_person_email      === '' ||
        payment_person_document   === '' ||
        payment_person_phone      === '' ||
        payment_person_cep        === '' ||
        payment_person_street     === '' ||
        payment_person_number     === '' ||
        payment_person_district   === '' ||
        payment_person_state      === '' ||
        payment_person_city       === '' ||
        payment_card_holder_name  === '' ||
        payment_card_number       === '' ||
        payment_card_brand        === '' ||
        payment_card_month        === '' ||
        payment_card_year         === '' ||
        payment_card_cvv          === '' ||
        payment_card_installments === ''
    ) {
        toastr.info('Preencha os campos obrigatórios')
        return false
    }

    const url = 'http://localhost:3001/api/payments'
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            name: payment_person_name,
            person_type: payment_person_type,
            email: payment_person_email,
            document: payment_person_document,
            phone: payment_person_phone,
            cep: payment_person_cep,
            street: payment_person_street,
            complement: payment_person_complement,
            number: payment_person_number,
            district: payment_person_district,
            state: payment_person_state,
            city: payment_person_city,
            holder_name: payment_card_holder_name,
            card_number: payment_card_number,
            brand: payment_card_brand,
            month: payment_card_month,
            year: payment_card_year,
            cvv: payment_card_cvv,
            installments: payment_card_installments
        })
    }
    
    const response = await fetch(url, options)

    if(response.status !== 204) {
        const responseMessage = await response.json()
        toastr.error(responseMessage)
        return false
    }

    if(response.status === 500) {
        toastr.error(toastrMessage);
        return false
    }
    
    $('.form-control').val('')

    $('#step3-tab').attr('href', '#step3')
    $('#step3-tab').tab('show')

    setTimeout(() => {
        window.location.reload()
    }, 3000)
}