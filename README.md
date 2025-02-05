Image Formatted as Text Map Viewer (IFTMViewer)
================================================
(ou Visualizador de Imagens Formatadas como Mapa Textual)

Este é um visualizador simples para arquivos com a extensão ".iftm". Esses são arquivos de texto que armazenam informações como largura, altura, paleta de cores e mapeamento. O formato foi desenvolvido para auxiliar estudantes de **Edição de Imagens** na compreensão básica da criação e do processamento digital de arquivos de imagem.

Este projeto é implementado como um pequeno serviço em *flask*, para facilitar a integração a um servidor próprio já existente. Para fazer o IFTMViewer funcionar com o seu projeto independente, basta incorporar o script [iftmviewer.js](js/iftmviewer.js).

Clique [aqui](#) para acessar o serviço de teste da aplicação.

Tanto o formato de imagem, quanto este pequeno software, são distribuídos sob a licença [GPL](LICENSE).

Como escrever um arquivo ".iftm"
================================
Crie um arquivo de texto e especifique as seguintes informações separadas por "espaço":
* **Largura**: um número inteiro, maior que 0, que represente a largura da imagem em pixels.
* **Altura**: um número inteiro, maior que 0, que represente a altura da imagem em pixels.
* **Paleta de cores**: uma sequência códigos hexadecimais que traduzem em cores no sistema [*RGBA*](https://pt.wikipedia.org/wiki/RGBA). A paleta de cores representa um conjunto de "N" cores indexadas a partir do valor 1 (primeira cor) até "N" (última cor).
* **Mapa**: um mapa composto de valores inteiros positivos que representam os pixels da imagem. Cada valor do mapa representa o índice das cores de acordo com a ordem que foi definida na paleta. Os pixels representados por 0 representam a transparência na imagem.

O exemplo Smiley 🙂
===================

Esta é a imagem [*smiley.iftm*](examples/smiley.iftm). Uma imagem de resolução de 16x16 pixels e uma paleta contendo apenas duas cores: preto (1), amarelo (2).

As cores obrigatoriamente devem ser definidas com o caractere "#" no início seguido de um valor hexadecimal. Você pode definir os valores de cores como:

* #CCC ou #CCCF — ambos exemplos equivalem ao código de cor *RGBA* #CCCCCCFF.

* #AABBCC ou #AABBCCDD — caso não defina o valor para alfa, como em #AABBCC, o valor 0xFF será atribuído como alfa automaticamente. No segundo exemplo temos o valor 0xDD como alfa.

```plain
16 16 #000000 #f7d00a
0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0
0 0 0 0 1 1 2 2 2 2 1 1 0 0 0 0
0 0 0 1 2 2 2 2 2 2 2 2 1 0 0 0
0 0 1 2 2 2 2 2 2 2 2 2 2 1 0 0
0 1 2 2 2 1 2 2 2 2 1 2 2 2 1 0
0 1 2 2 1 1 1 2 2 1 1 1 2 2 1 0
1 2 2 2 1 1 1 2 2 1 1 1 2 2 2 1
1 2 2 2 2 1 2 2 2 2 1 2 2 2 2 1
1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 1
1 2 2 1 2 2 2 2 2 2 2 2 1 2 2 1
0 1 2 1 2 2 2 2 2 2 2 2 1 2 1 0
0 1 2 2 1 2 2 2 2 2 2 1 2 2 1 0
0 0 1 2 2 1 1 1 1 1 1 2 2 1 0 0
0 0 0 1 2 2 2 2 2 2 2 2 1 0 0 0
0 0 0 0 1 1 2 2 2 2 1 1 0 0 0 0
0 0 0 0 0 0 1 1 1 1 0 0 0 0 0 0
```
## Resultado pelo visualizador

Caso a imagem seja muito pequena, o visualizador irá fornecer uma imagem em que cada informação do mapa equivalerá à 20 pixels da mesma cor. Esta característica pode ser desabilitada alterando o parâmetro de ***autoPixelSize*** da função ***setUpIFTMViewerFromFilepath*** para ***false***. 

<img src="static/img/smiley.png">

# Cite este repositório

Se você escrever um artigo científico ou descrever seu projeto envolvendo o IFTMViewer em uma página da web, eu ficaria muito grato se pudesse adicionar uma referência ao IFTMViewer. Para facilitar, forneço aqui alguns exemplos de citação, incluindo entradas nos formatos BibTeX, APA e ABNT, que você pode usar em seus próprios documentos:

### BibTex
```bibtex
@misc{maciel2025IFTMViewer,
    author = {Maciel, Vinícius Fonseca},
    title = {IFTMViewer v1.0},
    year = 2025,
    url = {https://github.com/ViniciusFM/IFTMViewer},
    urlaccessdate = {05 feb. 2025}
}
```
### APA
```plain
Maciel, V. F. (2025). IFTMViewer v1.0. Retrieved from https://github.com/ViniciusFM/IFTMViewer
```

### ABNT
```plain
MACIEL, V. F. IFTMViewer v1.0. 2025. Disponível em: <https://github.com/ViniciusFM/IFTMViewer>. Acessado em: 05 de fevereiro de 2024.
```

<hr>

Por: Vinícius F. Maciel

Acesse: [https://www.viniciusfm.pro.br/](https://www.viniciusfm.pro.br/)

<hr>