<head>
  <title>minesweeper</title>
  <style>
    body { background:#454545; }
    .grid { margin:0px auto; }
    .grid td { width:10px; height:10px; border:1px solid black; background-color:white;  }
    #clear { margin:20px auto; display:block; }
  </style>
</head>

<body>
{{>grid}}
{{>clear}}
</body>

<template name="grid">
  <button id="clear" class="btn btn-primary">Clear Grid</button>
  {{{gridMaker 100 100}}}
</template>

<template name="clear">

</template>
