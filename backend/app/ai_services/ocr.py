import httpx

class OCR:
    def __init__(self, api_key: str = 'helloworld', language: str = 'eng', overlay: bool = False):
        """ 
        overlay: Is OCR.space overlay required in your response.
                        Defaults to False.
        api_key: OCR.space API key.
                        Defaults to 'helloworld'.
        language: Language code to be used in OCR.
                        List of available language codes can be found on https://ocr.space/OCRAPI
                        Defaults to 'en'.
        """
        self.api_key = api_key
        self.language = language
        self.overlay = overlay

    async def ocr_space_file(self, filename: str):
        payload = {
            'isOverlayRequired': self.overlay,
            'apikey': self.api_key,
            'language': self.language,
        }

        with open(filename, 'rb') as f:
            files = {'file': (filename, f, 'application/octet-stream')}
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    'https://api.ocr.space/parse/image',
                    data=payload,
                    files=files
                )

        response_json = response.json()
        if response.status_code != 200:
            raise Exception(f"Error: {response_json.get('ErrorMessage', 'Unknown error')}")
        parsed_text = [result['ParsedText'] for result in response_json['ParsedResults']]
        return '\n'.join(parsed_text)


    async def ocr_space_url(self, url: str):
        """ OCR.space API request with remote file.
            Python3.5 - not tested on 2.7
        url: Image url.
        
        return: Result in JSON format.
        """

        payload = {
            'url': url,
            'isOverlayRequired': self.overlay,
            'apikey': self.api_key,
            'language': self.language,
                }
        async with httpx.AsyncClient() as client:
            response = await client.post('https://api.ocr.space/parse/image', data=payload)
            return response.text